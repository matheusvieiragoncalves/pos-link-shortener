export interface IDeleteLinkParams {
  shortUrl: string;
}

const BASE_URL = "http://localhost:3333/links";

export async function deleteLinkAPI({
  shortUrl,
}: IDeleteLinkParams): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/${shortUrl}`, {
      method: "DELETE",
    });

    if (response.status !== 200) {
      const { message } = await response.json();
      throw new Error(message);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to delete link");
  }
}
