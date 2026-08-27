import { useEffect, useState, type KeyboardEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { Exercise, ExerciseCatalog } from "../types/exercise";
import { createOneExercise, updateOneExercise } from "../api/ExerciseService";
import { getAllExerciseCatalog } from "../api/ExerciseCatalogService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const setFormSchema = z.object({
  exerciseCatalog: z.string().min(1, "Exercise is required"),
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((value) => Number(value) > 0, "Weight must be greater than 0"),
  reps: z
    .string()
    .min(1, "Reps is required")
    .refine((value) => Number(value) > 0, "Reps must be greater than 0"),
});

export type UpsertSetDialogMode = "editSet" | "addSet" | "log";

type UpsertSetDialogProps = {
  onSaveFailure: (error: string) => void;
  onSaveSuccess: () => void;
  open: boolean;
  onClose: () => void;
  mode: UpsertSetDialogMode;
} & (
  | {
      mode: "editSet";
      exercise: Exercise;
    }
  | {
      mode: "addSet";
      exerciseCatalog: Exercise["exerciseCatalog"];
    }
  | {
      mode: "log";
    }
);

type SetFormData = z.infer<typeof setFormSchema>;

const emptyForm: SetFormData = {
  exerciseCatalog: "",
  weight: "",
  reps: "",
};

const getInitialFormData = (
  props:
    | { mode: "editSet"; exercise: Exercise }
    | { mode: "addSet"; exerciseCatalog: Exercise["exerciseCatalog"] }
    | { mode: "log" },
): SetFormData => {
  if (props.mode === "editSet") {
    return {
      exerciseCatalog: props.exercise.exerciseCatalog._id,
      weight: String(props.exercise.weight),
      reps: String(props.exercise.reps),
    };
  }

  if (props.mode === "addSet") {
    return {
      exerciseCatalog: props.exerciseCatalog._id,
      weight: "",
      reps: "",
    };
  }

  return emptyForm;
};

const normalizeNonNegativeInput = (value: string) => {
  if (value === "") {
    return "";
  }

  if (!/^\d*\.?\d*$/.test(value)) {
    return null;
  }

  return value.replace(/^0+(?=\d)/, "");
};

export const UpsertSetDialog = ({
  onSaveFailure,
  onSaveSuccess,
  open,
  onClose,
  ...props
}: UpsertSetDialogProps) => {
  const mode = props.mode;
  const editExerciseId =
    props.mode === "editSet" ? props.exercise._id : undefined;
  const addCatalogId =
    props.mode === "addSet" ? props.exerciseCatalog._id : undefined;
  const [catalogOptions, setCatalogOptions] = useState<ExerciseCatalog[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<SetFormData>({
    resolver: zodResolver(setFormSchema),
    defaultValues: getInitialFormData(props),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getInitialFormData(props));
    // Only re-reset when the dialog opens or the edit/add target changes —
    // not on every render (props object identity changes each render).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props read for getInitialFormData; stable via mode/editExerciseId/addCatalogId
  }, [open, reset, mode, editExerciseId, addCatalogId]);

  const isNameDisabled = mode !== "log";

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

  const blockNegativeKeys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  const onSubmit = async (formData: SetFormData) => {
    try {
      if (mode === "editSet") {
        if (!editExerciseId) {
          onSaveFailure("Cannot update set: missing exercise id");
          return;
        }

        await updateOneExercise(
          editExerciseId,
          Number(formData.weight),
          Number(formData.reps),
        );
      } else {
        await createOneExercise({
          exerciseCatalog: formData.exerciseCatalog,
          weight: Number(formData.weight),
          reps: Number(formData.reps),
        });
      }

      reset(emptyForm);
      onSaveSuccess();
      onClose();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
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
          Add Workout
          <IconButton aria-label="close" onClick={onClose}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Controller
            name="exerciseCatalog"
            control={control}
            render={({ field, fieldState }) => {
              const selectedExercise =
                catalogOptions.find((item) => item._id === field.value) ??
                (props.mode === "editSet"
                  ? props.exercise.exerciseCatalog
                  : null) ??
                (props.mode === "addSet" ? props.exerciseCatalog : null);

              return (
                <Autocomplete
                  disabled={isNameDisabled}
                  disableClearable
                  options={catalogOptions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  value={selectedExercise ?? undefined}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue?._id ?? "");
                  }}
                  onBlur={field.onBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      fullWidth
                      label="Exercise Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              );
            }}
          />
          <Controller
            name="weight"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Weight"
                type="number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ""}
                onChange={(event) => {
                  const nextValue = normalizeNonNegativeInput(
                    event.target.value,
                  );
                  if (nextValue === null) {
                    return;
                  }
                  field.onChange(nextValue);
                }}
                onKeyDown={blockNegativeKeys}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            )}
          />
          <Controller
            name="reps"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Reps"
                type="number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ""}
                onChange={(event) => {
                  const nextValue = normalizeNonNegativeInput(
                    event.target.value,
                  );
                  if (nextValue === null) {
                    return;
                  }
                  field.onChange(nextValue);
                }}
                onKeyDown={blockNegativeKeys}
                slotProps={{ htmlInput: { min: 0 } }}
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
};
