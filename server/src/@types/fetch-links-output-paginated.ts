import type { ILink } from './link';

export interface IFetchLinksPaginatedOutput {
  links: ILink[];
  totalCount: number;
  nextCursor: number | null;
}
