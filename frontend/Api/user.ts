const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_PREFIX = "/api/v1/user";

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}${URL_PREFIX}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.user
  } catch (error) {
    console.log("error while login process", error);
    return null
  }
};

export const userSignup = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}${URL_PREFIX}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`Signup failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("response", data);
    return data.data
  } catch (error) {
    console.log("error while login process", error);
    return null
  }
};
