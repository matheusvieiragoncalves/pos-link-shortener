import type { ILink } from './link';

export interface IFetchLinksPaginatedOutput {
  links: ILink[];
  nextCursor: number | null;
}
