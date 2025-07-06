import type { ILink } from "../@types/link";

interface IFetchLinksParams {
  cursor?: number;
  pageSize?: number;
}

const BASE_URL = "http://192.168.1.17:3333/links";

export async function fetchLinksToAPI({
  cursor,
  pageSize,
}: IFetchLinksParams): Promise<{ links: ILink[]; nextCursor: number | null }> {
  try {
    let url = BASE_URL;

    if (cursor) {
      url += `?cursor=${cursor}`;
    }

    if (pageSize) {
      url += !url.includes("?") ? "?" : "&";
      url += `pageSize=${pageSize}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { links, nextCursor } = await response.json();

    return {
      links,
      nextCursor,
    };
  } catch (error) {
    console.error("Error fetching links:", error);
    throw new Error("Failed to fetch links");
  }
}
