interface IRedirectLinkParams {
  shortUrl: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/links";

export async function redirectLink({
  shortUrl,
}: IRedirectLinkParams): Promise<{ originalUrl: string }> {
  try {
    const url = `${BASE_URL}/${shortUrl}`;

    const response = await fetch(url);

    const { originalUrl } = await response.json();

    return {
      originalUrl,
    };
  } catch (error) {
    console.error("Error in redirect link:", error);
    throw new Error("Failed to redirect link");
  }
}
