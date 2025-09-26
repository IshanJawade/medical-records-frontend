import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReceptionAPI } from "./api";
import type { Receptionist } from "./types";

const KEY = ["receptions"]; // key name arbitrary; just be consistent

export const useReceptionists = () =>
  useQuery({ queryKey: KEY, queryFn: ReceptionAPI.list, refetchOnWindowFocus: false, staleTime: 300000 });

export const useCreateReceptionist = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ReceptionAPI.create, onSettled: () => qc.invalidateQueries({ queryKey: KEY }) });
};
export const useUpdateReceptionist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Receptionist> }) => ReceptionAPI.update(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
export const useDeleteReceptionist = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ReceptionAPI.remove(id), onSettled: () => qc.invalidateQueries({ queryKey: KEY }) });
};
