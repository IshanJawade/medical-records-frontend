import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReceptionAPI } from "./api";
import type { Receptions } from "./types";

const KEY = ["receptions"]; // key name arbitrary; just be consistent

export const useReceptions = () =>
  useQuery({ queryKey: KEY, queryFn: ReceptionAPI.list, refetchOnWindowFocus: false, staleTime: 300000 });

export const useCreateReceptions = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ReceptionAPI.create, onSettled: () => qc.invalidateQueries({ queryKey: KEY }) });
};
export const useUpdateReceptions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Receptions> }) => ReceptionAPI.update(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
export const useDeleteReceptions = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ReceptionAPI.remove(id), onSettled: () => qc.invalidateQueries({ queryKey: KEY }) });
};
