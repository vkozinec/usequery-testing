import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFlowers } from "./fetchFlowers";

export const useFlowers = () => {
  return useInfiniteQuery(["flowers"], fetchFlowers, {
    getNextPageParam: (lastPage) => lastPage.meta.pagination.next_page,
  });
};
