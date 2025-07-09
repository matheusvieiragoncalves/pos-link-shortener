import type { ILink } from "../@types/link";

export interface ICreateLinkParams {
  shortUrl: string;
  originalUrl: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/links";

export async function createLinkAPI({
  shortUrl,
  originalUrl,
}: ICreateLinkParams): Promise<ILink> {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortUrl, originalUrl }),
    });

    if (response.status !== 200) {
      const { message } = await response.json();

      throw new Error(message);
    }

    const { link } = await response.json();

    return link;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create link");
  }
}
