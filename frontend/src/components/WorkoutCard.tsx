import { useMemo, useState } from "react";
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
  exercise: Exercise[];
  selectedDate: Date;
}

export const WorkoutCard = ({
  onSaveFailure,
  // onEditSuccess,
  onDeleteSuccess,
  onSaveSuccess,
  exercise,
  selectedDate,
}: WorkoutCardProps) => {
  const [mode, setMode] = useState<UpsertSetDialogMode | null>(null);
  const [open, setOpen] = useState(false);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [editCatalog, setCatalog] = useState<
    Exercise["exerciseCatalog"] | null
  >(null);
  const groupedExercise = useMemo((): Record<string, Exercise[]> => {
    return exercise.reduce<Record<string, Exercise[]>>((acc, item) => {
      const key = item.exerciseCatalog?.id;
      if (!key) {
        return acc;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }, [exercise]);

  function handleEdit(item: Exercise) {
    if (!item) {
      return;
    }

    setMode("editSet");
    setEditExercise(item);
    setOpen(true);
  }

  function handleAddSet(exerciseCatalog: Exercise["exerciseCatalog"]) {
    setMode("addSet");
    setCatalog(exerciseCatalog);
    setOpen(true);
  }

  function handleAddExercise() {
    setMode("log");
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setMode(null);
    setEditExercise(null);
    setCatalog(null);
  };

  const [expandedByCatalogId, setExpandedByCatalogId] = useState<
    Record<string, boolean>
  >({});
  return (
    <CardContent sx={{ p: 1, }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardHeader title="My Workouts" />
        {mode === "editSet" && editExercise && (
          <UpsertSetDialog
            onSaveFailure={onSaveFailure}
            onSaveSuccess={onSaveSuccess}
            open={open}
            onClose={handleClose}
            mode="editSet"
            exercise={editExercise}
            selectedDate={selectedDate}
          />
        )}
        {mode === "addSet" && editCatalog && (
          <UpsertSetDialog
            onSaveFailure={onSaveFailure}
            onSaveSuccess={onSaveSuccess}
            open={open}
            onClose={handleClose}
            mode="addSet"
            exerciseCatalog={editCatalog}
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
        <Button variant="contained" onClick={handleAddExercise}>
          <AddIcon />
        </Button>
      </Stack>

      {Object.keys(groupedExercise).length > 0 &&
        Object.entries(groupedExercise).map(([catalogId, exercises]) => (
          <Accordion
            key={catalogId}
            expanded={expandedByCatalogId[catalogId] ?? false}
            onChange={(_event, isExpanded) => {
              setExpandedByCatalogId((prev) => ({
                ...prev,
                [catalogId]: isExpanded,
              }));
            }}
            sx={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${catalogId}-panel1-content`}
              id={`${catalogId}-panel1-header`}
            >
              <Typography component="div">
                {exercises[0].exerciseCatalog?.name ?? ""} |{" "}
                {`${exercises.length} ${exercises.length > 1 ? "Sets" : "Set"}`}{" "}
                | {exercises[0].exerciseCatalog?.targetMuscleGroup ?? ""}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SetTable
                onSaveFailure={onSaveFailure}
                sets={exercises}
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
