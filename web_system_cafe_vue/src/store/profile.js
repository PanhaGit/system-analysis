export const removeAcccessToken = () => {
  localStorage.removeItem("access_token");
};

export const getAcccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setAcccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const setProfile = (value) => {
  localStorage.setItem("profile", value);
};

export const getProfile = () => {
  try {
    const user = localStorage.getItem("profile");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null;
  }
};
