import { useMemo, useState } from "react";
import {
  useMediaQuery, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, Stack, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Snackbar, Alert, CircularProgress, Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from "../features/patients/hooks";
import type { Patient } from "../features/patients/types";
import { PatientSchema, type PatientForm } from "../features/patients/schema";
import PatientFormCmp from "../features/patients/components/PatientForm";

export default function PatientsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, error } = usePatients();
  const createMut = useCreatePatient();
  const updateMut = useUpdatePatient();
  const deleteMut = useDeletePatient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [snack, setSnack] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const patients = useMemo(() => data ?? [], [data]);

  const handleCreate = () => { setEditing(null); setOpen(true); };
  const handleEdit = (pat: Patient) => { setEditing(pat); setOpen(true); };

  const handleSubmit = async (form: PatientForm) => {
    try {
      const payload = PatientSchema.parse(form);
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: payload });
        setSnack({ type: "success", msg: "Patient updated" });
      } else {
        await createMut.mutateAsync(payload);
        setSnack({ type: "success", msg: "Patient created" });
      }
      setOpen(false);
    } catch (e: any) {
      setSnack({ type: "error", msg: e.message || "Save failed" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this patient?")) return;
    try {
      await deleteMut.mutateAsync(id);
      setSnack({ type: "success", msg: "Patient deleted" });
    } catch (e: any) {
      setSnack({ type: "error", msg: e.message || "Delete failed" });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{(error as Error).message}</Alert>;

  // ---- mobile: cards ----
  if (isMobile) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 style={{ margin: 0 }}>Patients</h2>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            New Patient
          </Button>
        </Stack>

        {patients.map((d) => (
          <Card key={d.id}>
            <CardContent>
              <Stack spacing={0.5}>
                <strong>{d.name}</strong>
				<div>MRN: {d.mrn || "—"}</div>
				<div>DOB: {d.dob || "—"}</div>
				<div>Sex: {d.sex || "—"}</div>
				<div>Phone: {d.phone || "—"}</div>
				<div>City: {d.city || "—"}</div>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="contained" onClick={() => handleEdit(d)}>Edit</Button>
                  <Button size="small" variant="outlined" onClick={() => handleDelete(d.id)}>Delete</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        <PatientDialog
          open={open}
          onClose={() => setOpen(false)}
          editing={editing}
          onSubmit={handleSubmit}
        />

        <Snackbar
          open={Boolean(snack)}
          autoHideDuration={3000}
          onClose={() => setSnack(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={snack?.type ?? "info"} sx={{ width: "100%" }}>
            {snack?.msg ?? ""}
          </Alert>
        </Snackbar>

      </Stack>
    );
  }

  // ---- desktop: table ----
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h2 style={{ margin: 0 }}>Patients</h2>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Patient
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "30%" }}>Name</TableCell>
            <TableCell>MRN</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right" style={{ width: 160 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((d) => (
            <TableRow key={d.id} hover>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.mrn || "—"}</TableCell>
              <TableCell>{d.dob || "—"}</TableCell>
			  <TableCell>{d.addressLine1 || "—"}</TableCell>
              <TableCell>{d.phone || "—"}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleEdit(d)} aria-label={`Edit ${d.name}`}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(d.id)} aria-label={`Delete ${d.name}`}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PatientDialog
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack?.type ?? "info"} sx={{ width: "100%" }}>
          {snack?.msg ?? ""}
        </Alert>
      </Snackbar>

    </>
  );
}

// ---------- Dialog ----------
function PatientDialog({
  open, onClose, editing, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  editing: Patient | null;
  onSubmit: (data: PatientForm) => void | Promise<void>;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Edit Patient" : "New Patient"}</DialogTitle>
      <DialogContent dividers>
        <PatientFormCmp
          defaultValues={{
            name: editing?.name ?? "",
            dob: editing?.dob ?? "",
            phone: editing?.phone ?? "",
            addressLine1: editing?.addressLine1 ?? "",
            addressLine2: editing?.addressLine2 ?? "",
            city: editing?.city ?? "",
            state: editing?.state ?? "",
            zip: editing?.zip ?? "",
          }}
          onSubmit={onSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          form="__hack"
          type="submit"
          onClick={() => {
            const form = document.querySelector("form");
            if (form) (form.querySelector('input[type="submit"]') as HTMLInputElement)?.click();
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
