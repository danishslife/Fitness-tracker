import { useState, type MouseEvent } from "react";
import type { Exercise } from "../types/exercise";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { deleteOneExercise } from "../api/ExerciseService";

interface SetTableProps {
  onSaveFailure: (error: string) => void;
  sets: Exercise[];
  onEdit: (item: Exercise) => void;
  onDeleteSuccess: () => void;
  onAddSet: (catalog: Exercise["exerciseCatalog"]) => void;
}

export const SetTable = ({
  sets,
  onEdit,
  onDeleteSuccess,
  onAddSet,
  onSaveFailure,
}: SetTableProps) => {
  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteOneExercise(id);
      onDeleteSuccess();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
    }
  };
  return (
    <Box sx={{ width: "100%", textAlign: "left" }}>
      <TableContainer>
        <Table
          size="small"
          sx={{
            width: "100%",
            "& thead th": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            },
            "& thead tr:hover": {
              backgroundColor: "transparent",
            },
            "& tbody tr:hover": {
              backgroundColor: "action.hover",
            },
          }}
          aria-label="sets"
        >
          <TableHead>
            <TableRow>
              <TableCell>Set</TableCell>
              <TableCell>Weight (lbs) </TableCell>
              <TableCell>Reps</TableCell>
              <TableCell align="right" sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sets.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.reps}</TableCell>
                <TableCell align="right">
                  <SetRowMenu
                    onEdit={() => onEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={4}
                sx={{
                  p: 0,
                  borderBottom: 0,
                  bgcolor: "transparent",
                  py: 1,
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => onAddSet(sets[0].exerciseCatalog)}
                  sx={{ color: "text.primary" }}
                >
                  Add Set
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

interface SetRowMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

const SetRowMenu = ({ onEdit, onDelete }: SetRowMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="Edit or delete set"
        aria-controls={open ? "set-row-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <Menu
        id="set-row-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete?.();
          }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
