interface IRedirectLinkParams {
  shortUrl: string;
}

const BASE_URL = "http://192.168.1.17:3333/links";

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
