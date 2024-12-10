import axios from "axios";
import { getAcccessToken, setAcccessToken } from "./profile";
import { setServerStatus } from "./serverStore";
import { Config } from "../util/Config";

export const request = async (url = "", method = "get", data = {}) => {
  const access_token = getAcccessToken(); // Get the token
  const headers = { "Content-Type": "application/json" };

  try {
    const res = await axios({
      url: Config.base_url + url,
      method: method,
      data: data,
      headers: {
        ...headers,
        Authorization: "Bearer " + access_token,
      },
    });

    setServerStatus(200);

    // If a new token is provided, update the stored token
    if (res.data.token) {
      setAcccessToken(res.data.token);
    }

    return res.data;
  } catch (err) {
    const response = err.response;
    if (response) {
      const status = response.status;
      if (status === 401) {
        setServerStatus(403);
      } else if (
        response.data &&
        response.data.error &&
        response.data.error.state
      ) {
        alert("Error: " + response.data.error);
      } else {
        setServerStatus(status);
      }
    } else if (err.code === "ERR_NETWORK") {
      setServerStatus("error");
    }

    console.log(">>>Error", err);
    return false;
  }
};
