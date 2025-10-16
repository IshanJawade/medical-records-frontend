import { api } from "../../api/client";
import type { Patient } from "./types";

const normalizePatient = (p: any): Patient => ({
	id: p.id,
	mrn: p.mrn,
	name: p.name,
	dob: p.dob ?? null,
	sex: p.sex ?? null,
	phone: p.phone ?? null,
	addressLine1: p.addressLine1 ?? p.address_line1 ?? null,
	addressLine2: p.addressLine2 ?? p.address_line2 ?? null,
	city: p.city ?? null,
	state: p.state ?? null,
	zip: p.zip ?? null,
	createdAt: p.createdAt ?? p.created_at ?? null,
	updatedAt: p.updatedAt ?? p.updated_at ?? null,
});
	
// unwrap common server shapes
const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?._embedded?.patients)) return data._embedded.patients;
  // as a last resort, if it’s a single object, treat it as a 1-item list
  return typeof data === "object" && data ? [data] : [];
};

// when server returns no body (201/204), just return null and let UI refetch
const maybeNormalize = (res: any): Patient | null => {
  if (!res || res === "" || res === undefined) return null;
  try { return normalizePatient(res); } catch { return null; }
};

export const PatientAPI = {
  list: async (): Promise<Patient[]> => {
	const res = await api.get("/patients");
	const raw = unwrapList(res.data);
	if (import.meta.env.DEV) console.log("GET /patients →", res.data);
	return raw.map(normalizePatient);
  },
  get: async (id: number): Promise<Patient> => {
	const res = await api.get(`/patients/${id}`);
	return normalizePatient(res.data);
  },
  create: async (payload: Partial<Patient>): Promise<Patient | null> => {
	const res = await api.post("/patients", {
	  mrn: payload.mrn,			
	  name: payload.name,
	  sex: payload.sex ?? null,
	  dob: payload.dob ?? null,
	  phone: payload.phone ?? null,
	  addressLine1: payload.addressLine1 ?? null,
	  addressLine2: payload.addressLine2 ?? null,
	  city: payload.city ?? null,
	  state: payload.state ?? null,
	  zip: payload.zip ?? null,
	});
	return maybeNormalize(res.data);
  },
  update: async (id: number, payload: Partial<Patient>): Promise<Patient | null> => {
	// send only the fields your server expects
	const body = {
	  name: payload.name,
	  dob: payload.dob ?? null,
	  phone: payload.phone ?? null,
	  addressLine1: payload.addressLine1 ?? null,
	  addressLine2: payload.addressLine2 ?? null,
	  city: payload.city ?? null,
	  state: payload.state ?? null,
	  zip: payload.zip ?? null,
	};

	// send PATCH instead of PUT
	const res = await api.patch(`/patients/${id}`, body);
	return maybeNormalize(res.data);
  },
  delete: async (id: number): Promise<void> => {
	await api.delete(`/patients/${id}`);
  },
};	
export default PatientAPI;