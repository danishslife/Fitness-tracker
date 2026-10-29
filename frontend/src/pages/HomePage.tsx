import { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAllWorkoutSets } from "../api/WorkoutSetService";
import type { WorkoutSet } from "../types/workoutSet";
import { WorkoutCard } from "../components/WorkoutCard";
import { WorkoutDatePicker } from "../components/WorkoutDatePicker";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

export const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchAllWorkoutSets = useCallback(async () => {
    try {
      const { workoutSets } = await getAllWorkoutSets(selectedDate);
      setData(workoutSets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    let cancelled = false;

    void getAllWorkoutSets(selectedDate).then(
      ({ workoutSets }) => {
        if (cancelled) {
          return;
        }
        setData(workoutSets);
        setError(null);
        setLoading(false);
      },
      (err: unknown) => {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setLoading(true);
  }, []);

  const handleFailure = useCallback((error: string) => {
    setError(error);
  }, []);

  return (
    <Box
      sx={{
        pt: 12,
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <WorkoutDatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </Box>

      <Card variant="outlined" sx={{ width: "100%" }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && (
          <WorkoutCard
            onSaveFailure={handleFailure}
            onEditSuccess={() => void fetchAllWorkoutSets()}
            onDeleteSuccess={() => void fetchAllWorkoutSets()}
            onSaveSuccess={() => void fetchAllWorkoutSets()}
            workoutSets={data}
            selectedDate={selectedDate}
          />
        )}
      </Card>
    </Box>
  );
};

export default HomePage;
