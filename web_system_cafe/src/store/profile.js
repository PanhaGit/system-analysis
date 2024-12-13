export const removeAcccessToken = () => {
  localStorage.removeItem("access_token");
};

export const getAcccessToken = () => {
  return localStorage.getItem("access_token");
};
// Sets the access token in local storage
export const setAcccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const setProfile = (value) => {
  localStorage.setItem("profile", value);
};

export const getProfile = () => {
  // convert string json to object
  try {
    var profile = localStorage.getItem("profile");
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    }
    return null;
  } catch (err) {
    return null;
  }
};
