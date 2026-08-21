import { useEffect, useState, type ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { CreateExerciseData, ExerciseCatalog } from "../types/exercise";
import { createOneExercise } from "../ExerciseService";
import { getAllExerciseCatalog } from "../ExerciseCatalogService";

interface UpsertSetDialogProps {
  onSaveFailure: (error: string) => void;
  onSaveSuccess: () => void;
}

export const UpsertSetDialog = ({
  onSaveFailure,
  onSaveSuccess,
}: UpsertSetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [catalogOptions, setCatalogOptions] = useState<ExerciseCatalog[]>([]);
  const [formData, setFormData] = useState<CreateExerciseData>({
    exerciseCatalog: "",
    weight: 0,
    reps: 0,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadCatalog() {
      try {
        const { exerciseCatalog } = await getAllExerciseCatalog();
        setCatalogOptions(exerciseCatalog);
      } catch (error) {
        onSaveFailure(error instanceof Error ? error.message : "Unknown error");
      }
    }

    void loadCatalog();
  }, [open, onSaveFailure]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = async () => {
    if (formData.exerciseCatalog && formData.weight && formData.reps) {
      try {
        setFormData({ exerciseCatalog: "", weight: 0, reps: 0 });
        await createOneExercise(formData);
        onSaveSuccess();
        handleClose();
      } catch (error) {
        onSaveFailure(error instanceof Error ? error.message : "Unknown error");
      }
    }
  };

  const selectedExercise =
    catalogOptions.find((item) => item._id === formData.exerciseCatalog) ??
    null;

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        ADD
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add Workout
          <IconButton aria-label="close" onClick={handleClose}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            options={catalogOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedExercise}
            onChange={(_event, newValue) => {
              setFormData({
                ...formData,
                exerciseCatalog: newValue?._id ?? "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                label="Exercise Name"
              />
            )}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Weight"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleFieldChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Reps"
            name="reps"
            type="number"
            value={formData.reps}
            onChange={handleFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddClick}>
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
