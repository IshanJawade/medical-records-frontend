import { api } from "../../api/client";
import type { Receptions } from "./types";

export type Receptionist = {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const normalize = (r: any): Receptions => ({
  id: r.id,
  name: r.name,
  phone: r.phone ?? null,
  email: r.email ?? null,
  createdAt: r.createdAt ?? r.created_at ?? null,
  updatedAt: r.updatedAt ?? r.updated_at ?? null,
});

const unwrap = (d: any) =>
  Array.isArray(d) ? d : (d?.content ?? d?.data ?? d?.items ?? []);

export const ReceptionAPI = {
  list: async (): Promise<Receptions[]> => {
    const res = await api.get("/receptions");              
    if (import.meta.env.DEV) console.log("GET /receptions →", res.status, res.data);
    return unwrap(res.data).map(normalize);
  },
  create: async (p: Partial<Receptions>) => {
    const res = await api.post("/receptions", {            
      name: p.name, phone: p.phone ?? null, email: p.email ?? null,
    });
    return res.data ? normalize(res.data) : null;
  },
  update: async (id: number, p: Partial<Receptions>) => {
    const res = await api.patch(`/receptions/${id}`, {     
      name: p.name, phone: p.phone, email: p.email,
    });
    return res.data ? normalize(res.data) : null; // handle 204
  },
  remove: async (id: number) => {
    await api.delete(`/receptions/${id}`);                 
  },
};
