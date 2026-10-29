import { useEffect, useState, type KeyboardEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { Exercise } from "../types/exercise";
import type { WorkoutSet } from "../types/workoutSet";
import { AddCustomExercise } from "./AddCustomExercise";
import {
  createOneWorkoutSet,
  updateOneWorkoutSet,
} from "../api/WorkoutSetService";
import { getAllExercises } from "../api/ExerciseService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const setFormSchema = z.object({
  exercise: z.number().int().positive("Exercise is required"),
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
  selectedDate: Date;
} & (
  | {
      mode: "editSet";
      workoutSet: WorkoutSet;
    }
  | {
      mode: "addSet";
      exercise: Exercise;
    }
  | {
      mode: "log";
    }
);

type SetFormData = z.infer<typeof setFormSchema>;

const hideNumberSpinnersSx = {
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};

const emptyForm: SetFormData = {
  exercise: 0,
  weight: "",
  reps: "",
};

const getInitialFormData = (
  props:
    | { mode: "editSet"; workoutSet: WorkoutSet }
    | { mode: "addSet"; exercise: Exercise }
    | { mode: "log" },
): SetFormData => {
  if (props.mode === "editSet") {
    return {
      exercise: props.workoutSet.exercise.id,
      weight: String(props.workoutSet.weight),
      reps: String(props.workoutSet.reps),
    };
  }

  if (props.mode === "addSet") {
    return {
      exercise: props.exercise.id,
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
  selectedDate,
  ...props
}: UpsertSetDialogProps) => {
  const mode = props.mode;
  const editWorkoutSetId =
    props.mode === "editSet" ? props.workoutSet.id : undefined;
  const addExerciseId =
    props.mode === "addSet" ? props.exercise.id : undefined;
  const [exerciseOptions, setExerciseOptions] = useState<Exercise[]>([]);
  const [openAddExercise, setOpenAddExercise] = useState(false);
  const [addExerciseDialogKey, setAddExerciseDialogKey] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props read for getInitialFormData; stable via mode/editWorkoutSetId/addExerciseId
  }, [open, reset, mode, editWorkoutSetId, addExerciseId]);

  const isNameDisabled = mode !== "log";

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
          onSaveFailure(
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, onSaveFailure]);

  const blockNegativeKeys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  const onSubmit = async (formData: SetFormData) => {
    try {
      if (mode === "editSet") {
        if (!editWorkoutSetId) {
          onSaveFailure("Cannot update set: missing workout set id");
          return;
        }

        await updateOneWorkoutSet(
          editWorkoutSetId,
          Number(formData.weight),
          Number(formData.reps),
        );
      } else {
        await createOneWorkoutSet({
          exercise: formData.exercise,
          weight: Number(formData.weight),
          reps: Number(formData.reps),
          performedAt: selectedDate.toISOString(),
        });
      }

      reset(emptyForm);
      onSaveSuccess();
      onClose();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
    }
  };

  function handleAddCustomExercise() {
    setAddExerciseDialogKey((key) => key + 1);
    setOpenAddExercise(true);
  }

  function handleCloseAddCustomExercise() {
    setOpenAddExercise(false);
  }

  async function handleCustomExerciseCreated(created: Exercise) {
    try {
      const { exercises } = await getAllExercises();
      setExerciseOptions(exercises);
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
      return;
    }

    setValue("exercise", created.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

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
            name="exercise"
            control={control}
            render={({ field, fieldState }) => {
              const selectedExercise =
                exerciseOptions.find((item) => item.id === field.value) ??
                (props.mode === "editSet" ? props.workoutSet.exercise : null) ??
                (props.mode === "addSet" ? props.exercise : null);

              return (
                <Autocomplete
                  disabled={isNameDisabled}
                  disableClearable
                  options={exerciseOptions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={selectedExercise ?? undefined}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue?.id ?? 0);
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
                sx={hideNumberSpinnersSx}
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
                sx={hideNumberSpinnersSx}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          {mode === "log" && (
            <AddCustomExercise
              key={addExerciseDialogKey}
              open={openAddExercise}
              onSaveSuccess={handleCustomExerciseCreated}
              onClose={handleCloseAddCustomExercise}
            />
          )}
          {mode === "log" && (
            <Button variant="contained" onClick={handleAddCustomExercise}>
              Add Exercise
            </Button>
          )}
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
