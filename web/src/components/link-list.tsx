import { CopyIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { useLinks } from "../store/links";
import { LinkItem } from "./link-item";
import { LinkListEmpty } from "./link-list-empty";
import { Button } from "./ui/button";
import { LoadingBar } from "./ui/loading-bar";

export function LinkList() {
  const links = useLinks((store) => store.links);
  const isLoading = useLinks((store) => store.isLoading);
  const nextCursor = useLinks((store) => store.nextCursor);
  const fetchLinks = useLinks((store) => store.fetchLinks);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && nextCursor && !isLoading) {
          fetchLinks();
        }
      },
      { threshold: 0.1, root: scrollContainerRef.current },
    );

    const current = observerRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [nextCursor, isLoading]);

  return (
    <div className="relative max-h-[100%] w-full overflow-scroll rounded-xl bg-white p-6 pb-3 shadow">
      {isLoading && <LoadingBar />}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Meus links</h3>

        <Button
          disabled
          className="flex max-w-26 flex-row gap-1.5 text-sm font-semibold"
          theme="secondary"
        >
          <CopyIcon className="h-4 w-4" />
          Baixar CSV
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="max-h-[40dvh] overflow-y-auto md:max-h-[78dvh]"
      >
        {!links.size ? (
          <LinkListEmpty />
        ) : (
          <>
            {Array.from(links.entries()).map(([id, link]) => (
              <LinkItem key={id} {...link} />
            ))}
            {nextCursor !== null && (
              <div
                ref={observerRef}
                className="h-8 w-full text-center text-sm text-gray-400"
              >
                Carregando mais...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
