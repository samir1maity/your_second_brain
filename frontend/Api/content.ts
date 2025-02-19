const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_PREFIX = "/api/v1/content";


export const postContent = async (token: string, data: any) => {
  try {
    console.log('reached to post content function')
    const response = await fetch(`${API_URL}${URL_PREFIX}`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to post content");
    }

    return await response.json();
  } catch (error) {
    console.error("Error while posting content:", error);
    throw error;
  }
};
