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
