import { api } from "./api";

export const fetchFlowers = async ({ pageParam = 1 }) => {
  const { data } = await api.get(`/v1/flowers?page=${pageParam}`);

  return data;
};
