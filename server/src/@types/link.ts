export interface ILink {
	id: string;
	originalUrl: string;
	customUrl: string;
	createdAt: Date;
}

export interface ICreateLinkInput {
	customUrl: string;
	originalUrl: string;
}
