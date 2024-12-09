export const setAcccessToken = (value) => {
  localStorage.removeItem("access_token", value);
};

export const getAcccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setProfile = (value) => {
  localStorage.setItem("profile", value);
};
