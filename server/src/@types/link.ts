export interface ILink {
	id: string;
	originalUrl: string;
	customUrl: string;
	createdAt: Date;
	accessCount: number;
}

export interface ICreateLinkInput {
	customUrl: string;
	originalUrl: string;
}
