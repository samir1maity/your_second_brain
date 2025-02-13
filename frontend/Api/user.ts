const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_PREFIX = "/api/v1/user";

export const userLogin = async (email: string, password: string) => {
  // login API
  try {
    console.log('reached to login handler');
    const response = fetch(`${API_URL}${URL_PREFIX}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("response", response);
  } catch (error) {
    console.log("error while login process", error);
  }
};

export const signup = () => {
  // signup API
};
