import { useMemo, useState } from "react";
import type { WorkoutSet } from "../types/workoutSet";
import type { Exercise } from "../types/exercise";
import {
  UpsertSetDialog,
  type UpsertSetDialogMode,
} from "../components/UpsertSetDialog";
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { SetTable } from "./SetTable";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

interface WorkoutCardProps {
  onSaveFailure: (error: string) => void;
  onEditSuccess: () => void;
  onDeleteSuccess: () => void;
  onSaveSuccess: () => void;
  workoutSets: WorkoutSet[];
  selectedDate: Date;
}

export const WorkoutCard = ({
  onSaveFailure,
  onDeleteSuccess,
  onSaveSuccess,
  workoutSets,
  selectedDate,
}: WorkoutCardProps) => {
  const [mode, setMode] = useState<UpsertSetDialogMode | null>(null);
  const [open, setOpen] = useState(false);
  const [editWorkoutSet, setEditWorkoutSet] = useState<WorkoutSet | null>(null);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const groupedByExercise = useMemo((): Record<string, WorkoutSet[]> => {
    return workoutSets.reduce<Record<string, WorkoutSet[]>>((acc, item) => {
      const key = item.exercise?.id;
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }, [workoutSets]);

  function handleEdit(item: WorkoutSet) {
    if (!item) {
      return;
    }

    setMode("editSet");
    setEditWorkoutSet(item);
    setOpen(true);
  }

  function handleAddSet(exercise: Exercise) {
    setMode("addSet");
    setEditExercise(exercise);
    setOpen(true);
  }

  function handleLogWorkout() {
    setMode("log");
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setMode(null);
    setEditWorkoutSet(null);
    setEditExercise(null);
  };

  const [expandedByExerciseId, setExpandedByExerciseId] = useState<
    Record<string, boolean>
  >({});
  return (
    <CardContent sx={{ p: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardHeader title="My Workouts" />
        {mode === "editSet" && editWorkoutSet && (
          <UpsertSetDialog
            onSaveFailure={onSaveFailure}
            onSaveSuccess={onSaveSuccess}
            open={open}
            onClose={handleClose}
            mode="editSet"
            workoutSet={editWorkoutSet}
            selectedDate={selectedDate}
          />
        )}
        {mode === "addSet" && editExercise && (
          <UpsertSetDialog
            onSaveFailure={onSaveFailure}
            onSaveSuccess={onSaveSuccess}
            open={open}
            onClose={handleClose}
            mode="addSet"
            exercise={editExercise}
            selectedDate={selectedDate}
          />
        )}
        {mode === "log" && (
          <UpsertSetDialog
            onSaveFailure={onSaveFailure}
            onSaveSuccess={onSaveSuccess}
            open={open}
            onClose={handleClose}
            mode="log"
            selectedDate={selectedDate}
          />
        )}
        <Button variant="contained" onClick={handleLogWorkout}>
          <AddIcon />
        </Button>
      </Stack>

      {Object.keys(groupedByExercise).length > 0 &&
        Object.entries(groupedByExercise).map(([exerciseId, sets]) => (
          <Accordion
            key={exerciseId}
            expanded={expandedByExerciseId[exerciseId] ?? false}
            onChange={(_event, isExpanded) => {
              setExpandedByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: isExpanded,
              }));
            }}
            sx={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${exerciseId}-panel1-content`}
              id={`${exerciseId}-panel1-header`}
            >
              <Typography component="div">
                {sets[0].exercise?.name ?? ""} |{" "}
                {`${sets.length} ${sets.length > 1 ? "Sets" : "Set"}`} |{" "}
                {sets[0].exercise?.targetMuscleGroup ?? ""}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SetTable
                onSaveFailure={onSaveFailure}
                sets={sets}
                onEdit={handleEdit}
                onDeleteSuccess={onDeleteSuccess}
                onAddSet={handleAddSet}
              />
            </AccordionDetails>
          </Accordion>
        ))}
    </CardContent>
  );
};
