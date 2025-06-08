export interface ILink {
  id: number;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date | null;
}

export interface ICreateLinkInput {
  shortUrl: string;
  originalUrl: string;
}
