import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PatientAPI } from "./api";
import type { Patient } from "./types";

export const usePatients = () =>
  useQuery({
	queryKey: ["patients"],
	queryFn: PatientAPI.list,
	refetchOnWindowFocus: false,
  	staleTime: 5 * 60 * 1000,
  });

export const useCreatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
	mutationFn: PatientAPI.create,
	onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
};

export const useUpdatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
	mutationFn: ({ id, data }: { id: number; data: Partial<Patient> }) =>
	  PatientAPI.update(id, data),
	onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
};

export const useDeletePatient = () => {
  const qc = useQueryClient();
  return useMutation({
	mutationFn: (id: number) => PatientAPI.delete(id),
	onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
};
