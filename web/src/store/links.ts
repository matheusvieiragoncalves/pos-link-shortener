import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ILink } from "../@types/link";
import { createLinkAPI, type ICreateLinkParams } from "../http/create-link";
import { deleteLinkAPI } from "../http/delete-link";
import { exportCSVLinksAPI } from "../http/export-csv-links";
import { fetchLinksToAPI } from "../http/fetch-links";
import { downloadUrl } from "../utils/download-url";
import { useToast } from "./toast";

type TLinksState = {
  links: Map<string, ILink>;
  nextCursor: number | null;
  isLoading: boolean;
  fetchLinks: () => void;
  addLink: (link: ICreateLinkParams) => Promise<{ created: boolean }>;
  deleteLink: (id: number) => void;
  exportCSVLinks: () => void;
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
          pageSize: 20,
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
        });

        useToast.getState().addToast({
          title: "Erro ao buscar links",
          message:
            "Não foi possível buscar os links, tente novamente mais tarde.",
          type: "error",
        });
      }
    }

    async function addLink(
      params: ICreateLinkParams,
    ): Promise<{ created: boolean }> {
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

        useToast.getState().addToast({
          title: "Cadastro realizado",
          message: "Links registrado com sucesso",
          type: "success",
        });

        return { created: true };
      } catch {
        set((state) => {
          state.isLoading = false;
        });

        useToast.getState().addToast({
          title: "Erro no cadastro",
          message: "Essa url encurtada já existe ou é inválida",
          type: "error",
        });

        return { created: false };
      }
    }

    async function deleteLink(id: number) {
      const link = get().links.get(id.toString());

      if (!link) return;

      set((state) => {
        state.isLoading = true;
      });

      try {
        const { shortUrl } = link;

        await deleteLinkAPI({ shortUrl });

        set((state) => {
          state.links.delete(id.toString());
          state.isLoading = false;
        });

        useToast.getState().addToast({
          title: "Link removido",
          message: "Link removido com sucesso",
          type: "success",
        });
      } catch {
        set((state) => {
          state.isLoading = false;
        });

        useToast.getState().addToast({
          title: "Erro na exclusão",
          message: "Não foi possível remover o link",
          type: "error",
        });
      }
    }

    async function exportCSVLinks() {
      set((state) => {
        state.isLoading = true;
      });

      try {
        const { url } = await exportCSVLinksAPI();

        await downloadUrl(url);

        set((state) => {
          state.isLoading = false;
        });

        useToast.getState().addToast({
          title: "Exportação realizada",
          message:
            "Links exportados com sucesso, verifique sua pasta de downloads",
          type: "success",
        });
      } catch {
        set((state) => {
          state.isLoading = false;
        });

        useToast.getState().addToast({
          title: "Erro na exportação",
          message: "Não foi possível exportar os links para CSV",
          type: "error",
        });
      }
    }

    return {
      links: new Map(),
      nextCursor: 0,
      isLoading: false,
      fetchLinks,
      addLink,
      deleteLink,
      exportCSVLinks,
    };
  }),
);
