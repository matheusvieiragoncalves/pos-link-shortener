export interface ILink {
  id: number;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  accessCount: number;
}

export interface ICreateLinkInput {
  shortUrl: string;
  originalUrl: string;
}
