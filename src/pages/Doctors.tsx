import {
  useMediaQuery, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, Stack, Button
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Doctor = { id: number; name: string; npi?: string; specialization?: string; phone?: string };

const mock: Doctor[] = [
  { id: 1, name: "Dr. Ada Lovelace", npi: "NPI-123", specialization: "Cardiology", phone: "+1-555-0100" },
  { id: 2, name: "Dr. Alan Turing", npi: "NPI-456", specialization: "Neurology", phone: "+1-555-0101" }
];

export default function DoctorsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {mock.map(d => (
          <Card key={d.id}>
            <CardContent>
              <Stack spacing={0.5}>
                <strong>{d.name}</strong>
                <div>NPI: {d.npi || "—"}</div>
                <div>Specialization: {d.specialization || "—"}</div>
                <div>Phone: {d.phone || "—"}</div>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="contained">Edit</Button>
                  <Button size="small" variant="outlined">Delete</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <h2 style={{ margin: 0 }}>Doctors</h2>
        <Button variant="contained">New Doctor</Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>NPI</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mock.map(d => (
            <TableRow key={d.id} hover>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.npi || "—"}</TableCell>
              <TableCell>{d.specialization || "—"}</TableCell>
              <TableCell>{d.phone || "—"}</TableCell>
              <TableCell align="right">
                <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                <Button size="small" variant="outlined">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
