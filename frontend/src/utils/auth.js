export const getAuth = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const isremember =
    localStorage.getItem("isremeber") === "true";

  return { token, user, isremember };
};
