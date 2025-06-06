export class ShortUrlUnavailableError extends Error {
  constructor() {
    super('Short URL is unavailable');
  }
}
