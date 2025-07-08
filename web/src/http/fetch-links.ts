import type { ILink } from "../@types/link";

interface IFetchLinksParams {
  cursor: number;
  pageSize: number;
}

const BASE_URL = "http://localhost:3333/links";

export async function fetchLinksToAPI({
  cursor,
  pageSize,
}: IFetchLinksParams): Promise<{ links: ILink[]; nextCursor: number | null }> {
  try {
    const url =
      BASE_URL + `?cursor=${cursor}&pageSize=${pageSize}&sortDirection=desc`;

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
    console.log("Error fetching links:", error);
    throw new Error("Failed to fetch links");
  }
}
