export class CustomUrlUnavailableError extends Error {
	constructor() {
		super('Custom URL is unavailable');
	}
}
