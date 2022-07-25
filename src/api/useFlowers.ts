import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFlowers } from "./fetchFlowers";

export const useFlowers = () => {
  return useInfiniteQuery(["flowers"], fetchFlowers, {
    getNextPageParam: (lastPage: any, pages: any) => {
      const nextPage = pages.length + 1;

      return lastPage.meta.pagination.current_page <
        lastPage.meta.pagination.total_pages
        ? nextPage
        : undefined;
    },
  });
};
