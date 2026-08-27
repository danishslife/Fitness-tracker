import { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAllExercises } from "../ExerciseService";
import type { Exercise } from "../types/exercise";
import { WorkoutCard } from "../components/WorkoutCard";
import { WorkoutDatePicker } from "../components/WorkoutDatePicker";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
export const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchAllExercises = useCallback(async (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const { exercises } = await getAllExercises(selectedDate);
      setData(exercises);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    void fetchAllExercises(true);
  }, [fetchAllExercises]);

  const handleFailure = useCallback((error: string) => {
    setError(error);
  }, []);

  return (
    <Box
      sx={{
        mt: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        width: 600,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <WorkoutDatePicker
          selectedDate={selectedDate}
          onDateSelect={(date) => setSelectedDate(date)}
        />
      </Box>

      <Card variant="outlined" sx={{ width: "100%" }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && (
          <WorkoutCard
            onSaveFailure={handleFailure}
            onEditSuccess={() => void fetchAllExercises()}
            onDeleteSuccess={() => void fetchAllExercises()}
            onSaveSuccess={() => void fetchAllExercises()}
            exercise={data}
          />
        )}
      </Card>
    </Box>
  );
};

export default HomePage;
