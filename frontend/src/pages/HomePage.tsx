import { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAllExercises } from "../api/ExerciseService";
import type { Exercise } from "../types/exercise";
import { WorkoutCard } from "../components/WorkoutCard";
import { WorkoutDatePicker } from "../components/WorkoutDatePicker";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

type HomePageProps = {
  onLogout: () => void;
};

export const HomePage = ({ onLogout }: HomePageProps) => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchAllExercises = useCallback(async () => {
    try {
      const { exercises } = await getAllExercises(selectedDate);
      setData(exercises);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    let cancelled = false;

    void getAllExercises(selectedDate).then(
      ({ exercises }) => {
        if (cancelled) {
          return;
        }
        setData(exercises);
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
        mt: 16,
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
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button type="button" onClick={onLogout}>
          Log out
        </Button>
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
            onEditSuccess={() => void fetchAllExercises()}
            onDeleteSuccess={() => void fetchAllExercises()}
            onSaveSuccess={() => void fetchAllExercises()}
            exercise={data}
            selectedDate={selectedDate}
          />
        )}
      </Card>
    </Box>
  );
};

export default HomePage;
