export interface ILink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  accessCount: number;
}

export interface ICreateLinkInput {
  shortUrl: string;
  originalUrl: string;
}
