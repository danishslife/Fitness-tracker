import { useMemo } from "react";
// import { deleteOneExercise, updateOneExercise } from "../ExerciseService";
import type { Exercise } from "../types/exercise";
// import type { FocusEvent } from "react";
import { UpsertSetDialog } from "../components/UpsertSetDialog";
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

interface WorkoutCardProps {
  onSaveFailure: (error: string) => void;
  onEditSuccess: () => void;
  onDeleteSuccess: () => void;
  onSaveSuccess: () => void;
  exercise: Exercise[];
}

export const WorkoutCard = ({
  onSaveFailure,
  // onEditSuccess,
  // onDeleteSuccess,
  onSaveSuccess,
  exercise,
}: WorkoutCardProps) => {
  const groupedExercise = useMemo(
    () =>
      exercise.reduce<Record<string, Exercise[]>>((acc, item) => {
        const key = item.exerciseCatalog?._id;
        if (!key) {
          return acc;
        }
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {}),
    [exercise],
  );
  return (
    <CardContent>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardHeader title="My Workouts" />
        <UpsertSetDialog
          onSaveFailure={onSaveFailure}
          onSaveSuccess={onSaveSuccess}
        />
      </Stack>

      {Object.keys(groupedExercise).length > 0 &&
        Object.entries(groupedExercise).map(([catalogId, exercises]) => (
          <Accordion key={catalogId} sx={{ width: "100%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${catalogId}-panel1-content`}
              id={`${catalogId}-panel1-header`}
            >
              <Typography component="div">
                {exercises[0].exerciseCatalog?.name ?? ""} x {exercises.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1} sx={{ width: "100%" }}>
                {exercises.map((item) => (
                  <Typography key={item._id} component="div">
                    {item.weight} lbs · {item.reps} reps
                  </Typography>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
    </CardContent>
  );
};
