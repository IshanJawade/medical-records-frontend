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
import ReceptionistFormCmp from "../features/receptions/components/ReceptionForm";
import { useReceptions, useCreateReceptions, useUpdateReceptions, useDeleteReceptions } from "../features/receptions/hooks";
import type { Receptions } from "../features/receptions/types";
import { ReceptionsSchema, type ReceptionsForm } from "../features/receptions/schema";

export default function ReceptionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, error } = useReceptions();
  const createMut = useCreateReceptions();
  const updateMut = useUpdateReceptions();
  const deleteMut = useDeleteReceptions();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Receptions | null>(null);
  const [snack, setSnack] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const receptions = useMemo(() => data ?? [], [data]);

  const handleCreate = () => { setEditing(null); setOpen(true); };
  const handleEdit = (doc: Receptions) => { setEditing(doc); setOpen(true); };

  const handleSubmit = async (form: ReceptionsForm) => {
	try {
	  const payload = ReceptionsSchema.parse(form);
	  if (editing) {
		await updateMut.mutateAsync({ id: editing.id, data: payload });
		setSnack({ type: "success", msg: "Receptionist updated" });
	  } else {
		await createMut.mutateAsync(payload);
		setSnack({ type: "success", msg: "Receptionist created" });
	  }
	  setOpen(false);
	} catch (e: any) {
	  setSnack({ type: "error", msg: e.message || "Save failed" });
	}
  };

  const handleDelete = async (id: number) => {
	if (!confirm("Delete this receptions?")) return;
	try {
	  await deleteMut.mutateAsync(id);
	  setSnack({ type: "success", msg: "Receptions deleted" });
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
		  <h2 style={{ margin: 0 }}>Receptions</h2>
		  <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
			New
		  </Button>
		</Stack>

		{receptions.map((d) => (
		  <Card key={d.id}>
			<CardContent>
			  <Stack spacing={0.5}>
				<strong>{d.name}</strong>
				<div>Phone: {d.phone || "—"}</div>
				<div>Email: {d.email || "—"}</div>
				<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
				  <Button size="small" variant="contained" onClick={() => handleEdit(d)}>Edit</Button>
				  <Button size="small" variant="outlined" onClick={() => handleDelete(d.id)}>Delete</Button>
				</Stack>
			  </Stack>
			</CardContent>
		  </Card>
		))}

		<ReceptionsDialog
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
		<h2 style={{ margin: 0 }}>Receptions</h2>
		<Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
		  New Reception
		</Button>
	  </Stack>

	  <Table>
		<TableHead>
		  <TableRow>
			<TableCell style={{ width: "30%" }}>Name</TableCell>
			<TableCell>Phone</TableCell>
			<TableCell>Email</TableCell>
			<TableCell align="right" style={{ width: 160 }}>Actions</TableCell>
		  </TableRow>
		</TableHead>
		<TableBody>
		  {receptions.map((r) => (
			<TableRow key={r.id} hover>
			  <TableCell>{r.name}</TableCell>
			  <TableCell>{r.phone || "—"}</TableCell>
			  <TableCell>{r.email || "—"}</TableCell>
			  <TableCell align="right">
				<IconButton size="small" onClick={() => handleEdit(r)} aria-label={`Edit ${r.name}`}>
				  <EditIcon />
				</IconButton>
				<IconButton size="small" onClick={() => handleDelete(r.id)} aria-label={`Delete ${r.name}`}>
				  <DeleteIcon />
				</IconButton>
			  </TableCell>
			</TableRow>
		  ))}
		</TableBody>
	  </Table>

	  <ReceptionsDialog
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
function ReceptionsDialog({
  open, onClose, editing, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  editing: Receptions | null;
  onSubmit: (data: ReceptionsForm) => void | Promise<void>;
}) {
  return (
	<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
	  <DialogTitle>{editing ? "Edit Reception" : "New Reception"}</DialogTitle>
	  <DialogContent dividers>
		<ReceptionistFormCmp
		  defaultValues={{
			name: editing?.name ?? "",
			phone: editing?.phone ?? "",
			email: editing?.email ?? "",
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
