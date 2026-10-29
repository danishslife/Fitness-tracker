import { createOneExercise, getAllExercises } from "../api/ExerciseService";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Exercise } from "../types/exercise";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type AddCustomExerciseProps = {
  open: boolean;
  onSaveSuccess: (created: Exercise) => void;
  onClose: () => void;
};
const setFormSchema = z.object({
  name: z.string().min(3, "Exercise Name is too short"),
  targetMuscleGroup: z.string().min(3, "Target Muscle Group is too short"),
});

type SetFormData = z.infer<typeof setFormSchema>;

const emptyForm: SetFormData = {
  name: "",
  targetMuscleGroup: "",
};

export function AddCustomExercise({
  open,
  onSaveSuccess,
  onClose,
}: AddCustomExerciseProps) {
  const [exerciseOptions, setExerciseOptions] = useState<Exercise[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, isValid },
  } = useForm<SetFormData>({
    resolver: zodResolver(setFormSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    getAllExercises()
      .then(({ exercises }) => {
        if (!cancelled) {
          setExerciseOptions(exercises);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const onSubmit = async (formData: SetFormData) => {
    try {
      const isDuplicate = exerciseOptions.some(
        (c) =>
          c.name.trim().toLowerCase() === formData.name.trim().toLowerCase(),
      );

      if (isDuplicate) {
        setError("name", { message: "This exercise already exists" });
        return;
      }

      const created = await createOneExercise({
        name: formData.name,
        targetMuscleGroup: formData.targetMuscleGroup,
      });

      reset(emptyForm);
      onSaveSuccess(created);
      onClose();
    } catch (error) {
      setError("name", {
        message:
          error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit(onSubmit),
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add Exercise
          <IconButton aria-label="close" onClick={onClose}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loadError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {loadError}
            </Alert>
          ) : null}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Exercise Name"
                type="text"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  field.onChange(nextValue);
                }}
              />
            )}
          />
          <Controller
            name="targetMuscleGroup"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Target Muscle Group"
                type="text"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  field.onChange(nextValue);
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || !isDirty}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
