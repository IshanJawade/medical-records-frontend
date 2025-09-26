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
import DoctorFormCmp from "../features/doctors/components/DoctorForm";
import { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from "../features/doctors/hooks";
import type { Doctor } from "../features/doctors/types";
import { DoctorSchema, type DoctorForm } from "../features/doctors/schema";

export default function DoctorsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, error } = useDoctors();
  const createMut = useCreateDoctor();
  const updateMut = useUpdateDoctor();
  const deleteMut = useDeleteDoctor();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [snack, setSnack] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const doctors = useMemo(() => data ?? [], [data]);

  const handleCreate = () => { setEditing(null); setOpen(true); };
  const handleEdit = (doc: Doctor) => { setEditing(doc); setOpen(true); };

  const handleSubmit = async (form: DoctorForm) => {
    try {
      const payload = DoctorSchema.parse(form);
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: payload });
        setSnack({ type: "success", msg: "Doctor updated" });
      } else {
        await createMut.mutateAsync(payload);
        setSnack({ type: "success", msg: "Doctor created" });
      }
      setOpen(false);
    } catch (e: any) {
      setSnack({ type: "error", msg: e.message || "Save failed" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      await deleteMut.mutateAsync(id);
      setSnack({ type: "success", msg: "Doctor deleted" });
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
          <h2 style={{ margin: 0 }}>Doctors</h2>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            New
          </Button>
        </Stack>

        {doctors.map((d) => (
          <Card key={d.id}>
            <CardContent>
              <Stack spacing={0.5}>
                <strong>{d.name}</strong>
                <div>NPI: {d.npi || "—"}</div>
                <div>Specialty: {d.specialty || "—"}</div>
                <div>Phone: {d.phone || "—"}</div>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="contained" onClick={() => handleEdit(d)}>Edit</Button>
                  <Button size="small" variant="outlined" onClick={() => handleDelete(d.id)}>Delete</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        <DoctorDialog
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
        <h2 style={{ margin: 0 }}>Doctors</h2>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Doctor
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "30%" }}>Name</TableCell>
            <TableCell>NPI</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right" style={{ width: 160 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.map((d) => (
            <TableRow key={d.id} hover>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.npi || "—"}</TableCell>
              <TableCell>{d.specialty || "—"}</TableCell>
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

      <DoctorDialog
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
function DoctorDialog({
  open, onClose, editing, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  editing: Doctor | null;
  onSubmit: (data: DoctorForm) => void | Promise<void>;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Edit Doctor" : "New Doctor"}</DialogTitle>
      <DialogContent dividers>
        <DoctorFormCmp
          defaultValues={{
            name: editing?.name ?? "",
            npi: editing?.npi ?? "",
            phone: editing?.phone ?? "",
            specialty: editing?.specialty ?? "",
          }}
          onSubmit={onSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button form="__hack" type="submit" onClick={() => {
          // submit the form programmatically by querying the form element
          const form = document.querySelector("form");
          if (form) (form.querySelector('input[type="submit"]') as HTMLInputElement)?.click();
        }} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
