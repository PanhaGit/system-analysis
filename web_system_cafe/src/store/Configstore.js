import axios from "axios";
import { setServerStatus } from "./serverStore";
import { Config } from "../util/Config";
import {
  getAcccessToken,
  removeAcccessToken,
  setAcccessToken,
} from "./profile";

const handleError = async (err, url) => {
  const response = err.response;
  let status = "error";

  if (response) {
    status = response.status;

    if (status === 401) {
      console.warn("Unauthorized access. Attempting token refresh...");
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request
        return request(url, err.config.method, err.config.data);
      } else {
        console.error("Token refresh failed. Logging out.");
        removeAcccessToken();
        window.location.href = "/login"; // Redirect to login
      }
    } else if (status === 422) {
      console.error("Validation Error:", response.data);
      setServerStatus(response.data);
    } else {
      console.error("Request failed:", {
        status,
        message: response.data?.message || "Unknown error",
        url,
      });
    }
  } else if (err.code === "ERR_NETWORK") {
    console.error("Network Error:", err.message);
  }

  setServerStatus(status);
  return false;
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${Config.base_url}/v1/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${getAcccessToken()}` },
      }
    );
    const newToken = res.data.access_token;
    setAcccessToken(newToken);
    console.log("Token refreshed successfully.");
    return true;
  } catch (err) {
    console.error("Failed to refresh token:", err.message);
    return false;
  }
};

export const request = (url = "", method = "get", data = {}) => {
  const access_token = getAcccessToken();
  const headers = { "Content-Type": "application/json" };

  return axios({
    url: `${Config.base_url}${url}`,
    method,
    data,
    headers: {
      ...headers,
      Authorization: `Bearer ${access_token}`,
    },
    timeout: 5000,
  })
    .then((res) => {
      setServerStatus(200);
      return res.data;
    })
    .catch((err) => handleError(err, url));
};
