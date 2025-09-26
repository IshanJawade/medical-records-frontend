import { api } from "../../api/client";
import type { Doctor } from "./types";

const normalizeDoctor = (d: any): Doctor => ({
  id: d.id,
  name: d.name,
  npi: d.npi ?? null,
  phone: d.phone ?? null,
  specialty: d.specialty ?? d.specialization ?? d.speciality ?? null,
  createdAt: d.createdAt ?? d.created_at ?? null,
  updatedAt: d.updatedAt ?? d.updated_at ?? null,
});

// unwrap common server shapes
const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?._embedded?.doctors)) return data._embedded.doctors;
  // as a last resort, if it’s a single object, treat it as a 1-item list
  return typeof data === "object" && data ? [data] : [];
};

// when server returns no body (201/204), just return null and let UI refetch
const maybeNormalize = (res: any): Doctor | null => {
  if (!res || res === "" || res === undefined) return null;
  try { return normalizeDoctor(res); } catch { return null; }
};

export const DoctorAPI = {
  list: async (): Promise<Doctor[]> => {
    const res = await api.get("/doctors");
    const raw = unwrapList(res.data);
    if (import.meta.env.DEV) console.log("GET /doctors →", res.data);
    return raw.map(normalizeDoctor);
  },
  get: async (id: number): Promise<Doctor> => {
    const res = await api.get(`/doctors/${id}`);
    return normalizeDoctor(res.data);
  },
  create: async (payload: Partial<Doctor>): Promise<Doctor | null> => {
    const res = await api.post("/doctors", {
      name: payload.name,
      npi: payload.npi ?? null,
      phone: payload.phone ?? null,
      specialty: payload.specialty ?? null,
    });
    return maybeNormalize(res.data);
  },
  update: async (id: number, payload: Partial<Doctor>): Promise<Doctor | null> => {
  // send only the fields your server expects
  const body = {
    name: payload.name,
    npi: payload.npi ?? null,
    phone: payload.phone ?? null,
    specialty: payload.specialty ?? null,
  };

  // send PATCH instead of PUT
  const res = await api.patch(`/doctors/${id}`, body);
  return res.data ?? null; // handles 204 No Content
},
  remove: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
};
