const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_PREFIX = "/api/v1/tag"; 

export const getAllTags = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}${URL_PREFIX}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tags`);
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error; 
  }
};
