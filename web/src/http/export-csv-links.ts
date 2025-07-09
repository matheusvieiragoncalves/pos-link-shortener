const BASE_URL = "http://localhost:3333/links";

export async function exportCSVLinksAPI(): Promise<{ url: string }> {
  try {
    const response = await fetch(`${BASE_URL}/exports`, {
      method: "GET",
    });

    if (response.status !== 200) {
      const { message } = await response.json();
      throw new Error(message);
    }

    const { url } = await response.json();

    return { url };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to export CSV");
  }
}
