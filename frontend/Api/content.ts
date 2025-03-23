const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_PREFIX = "/api/v1/content";


export const postContent = async (token: string, data: any) => {
  try {
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

export const getContents = async (token: string, page = 1, limit = 15) => {
  try {
    const response = await fetch(`${API_URL}${URL_PREFIX}/all?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get contents");
    }

    return await response.json();
  } catch (error) {
    console.error("Error while fetching content:", error);
    throw error;
  }
};

export const searchContent = async (token: string, searchQuery: string, page: number, limit: number) => {
  try {
    const response = await fetch(`${API_URL}${URL_PREFIX}?searchQuery=${searchQuery}&page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get contents");
    }

    return await response.json();
  } catch (error) {
    console.error("Error while posting content:", error);
    throw error;
  }
};

export async function getContentByTags(token: string, tags: string[], page: number = 1, limit: number = 15) {
  try {
    const response = await fetch(`${API_URL}/content/filter-by-tags?page=${page}&limit=${limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tags })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch content by tags');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching content by tags:', error);
    throw error;
  }
}