import { defineStore } from "pinia";
import { getAcccessToken, setAcccessToken } from "./profile";
import { setServerStatus } from "./serverStore";
import axios from "axios";
import { Config } from "../util/Config";

export const globeState = defineStore("state", {
  state: () => ({
    user: null,
    error: "",
  }),

  actions: {
    async request(url = "", method = "get", data = {}) {
      const access_token = getAcccessToken();
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

        // Assuming the response contains user data and a token to store
        if (res.data.token) {
          setAcccessToken(res.data.token);
          this.user = res.data.user;
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
            this.error = data.error;
            alert(1);
          } else {
            setServerStatus(status);
          }
        } else if (err.code === "ERR_NETWORK") {
          setServerStatus("error");
        }

        console.log(">>>", err); // Logging the error for debugging
        return false;
      }
    },
  },
});
