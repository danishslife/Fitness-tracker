import { useEffect, useState } from "react";
import { getAllExercises } from "./ExerciseService";
import type { Exercise } from "./types/exercise";
import { Pagination } from "./components/Pagination";
import { AddExerciseForm } from "./components/AddExerciseForm";
import { FilterPanel } from "./components/FilterPanel";
import { DataTable } from "./components/DataTable";
import { WorkoutCalendar } from "./components/Calender";

const ITEMS_PER_PAGE = 10;

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      try {
        const { count, exercises } = await getAllExercises(
          currentPage,
          searchTerm,
          selectedDate,
        );
        setData(exercises);
        setTotal(count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [currentPage, searchTerm, selectedDate]);

  const handleFailure = (error: string) => {
    setError(error);
  };
  const fetchAllExercises = async () => {
    setLoading(true);
    try {
      const { count, exercises } = await getAllExercises(
        currentPage,
        searchTerm,
        selectedDate,
      );
      setData(exercises);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: string) => {
    setCurrentPage(1);
    setSearchTerm(e);
  };

  return (
    <div className="container">
      <WorkoutCalendar
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
      />

      <AddExerciseForm
        onSaveFailure={handleFailure}
        onSaveSuccess={fetchAllExercises}
      />

      <div className="search-table-container">
        <FilterPanel searchTerm={searchTerm} onSearhChange={handleSearch} />

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <DataTable
            onSaveFailure={handleFailure}
            onEditSuccess={fetchAllExercises}
            onDeleteSuccess={fetchAllExercises}
            exercise={data}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default HomePage;
