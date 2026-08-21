import { useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAllExercises } from "../ExerciseService";
import type { Exercise } from "../types/exercise";
import { SetTable } from "../components/SetTable";
import { WorkoutDatePicker } from "../components/WorkoutDatePicker";

export const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      try {
        const { exercises } = await getAllExercises(selectedDate);
        setData(exercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [selectedDate]);

  const handleFailure = useCallback((error: string) => {
    setError(error);
  }, []);

  const fetchAllExercises = async () => {
    setLoading(true);
    try {
      const { exercises } = await getAllExercises(selectedDate);
      setData(exercises);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <WorkoutDatePicker
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
      />


      <Stack spacing={2} sx={{ width: "100%" }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <SetTable
            onSaveFailure={handleFailure}
            onEditSuccess={fetchAllExercises}
            onDeleteSuccess={fetchAllExercises}
            onSaveSuccess={fetchAllExercises}
            exercise={data}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default HomePage;
