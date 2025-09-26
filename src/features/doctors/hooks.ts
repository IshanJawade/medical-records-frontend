import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DoctorAPI } from "./api";
import type { Doctor } from "./types";

export const useDoctors = () =>
  useQuery({
    queryKey: ["doctors"],
    queryFn: DoctorAPI.list,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
});

export const useCreateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DoctorAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
};

export const useUpdateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Doctor> }) =>
      DoctorAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
};

export const useDeleteDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DoctorAPI.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
};
