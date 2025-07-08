import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ILink } from "../@types/link";
import { createLinkAPI, type ICreateLinkParams } from "../http/create-link";
import { fetchLinksToAPI } from "../http/fetch-links";
import { useToast } from "./toast";

type TLinksState = {
  links: Map<string, ILink>;
  nextCursor: number | null;
  isLoading: boolean;
  fetchLinks: () => void;
  addLink: (link: ICreateLinkParams) => void;
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

    async function addLink(params: ICreateLinkParams) {
      set((state) => {
        state.isLoading = true;
      });

      try {
        const result = await createLinkAPI(params);

        const { id, originalUrl, shortUrl, accessCount } = result;

        set((state) => {
          state.links = new Map([
            [id.toString(), { id, originalUrl, shortUrl, accessCount }],
            ...state.links,
          ]);

          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
        });

        useToast
          .getState()
          .show({ title: "Erro no cadastro", message: "Essa URL já existe" });

        console.log(error);
      }
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
