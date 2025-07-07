import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ILink } from "../@types/link";
import { fetchLinksToAPI } from "../http/fetch-links";

type TLinksState = {
  links: Map<string, ILink>;
  nextCursor: number | null;
  isLoading: boolean;
  fetchLinks: (cursor?: number, pageSize?: number) => void;
  addLink: (link: ILink) => void;
};

enableMapSet();

export const useLinks = create<TLinksState, [["zustand/immer", never]]>(
  immer((set, get) => {
    async function fetchLinks() {
      const cursor = get().nextCursor;

      if (cursor === null) return;

      set((state) => {
        state.isLoading = true;
      });

      try {
        const { links, nextCursor } = await fetchLinksToAPI({
          cursor,
          pageSize: 10,
        });

        set((state) => {
          links.forEach((link) => {
            state.links.set(link.id.toString(), link);
          });
          state.nextCursor = nextCursor;
          state.isLoading = false;
        });
      } catch {
        set((state) => {
          state.isLoading = false;
          state.nextCursor = null;
          state.links.clear();
        });
      }
    }

    function addLink(link: ILink) {
      set((state) => {
        state.links.set(link.id.toString(), link);
      });
    }

    return {
      links: new Map(),
      nextCursor: 0,
      isLoading: false,
      fetchLinks,
      addLink,
    };
  }),
);
