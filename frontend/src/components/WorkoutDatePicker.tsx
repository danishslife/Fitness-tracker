import dayjs, { type Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface WorkoutDatePickerProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const WorkoutDatePicker = ({
  onDateSelect,
  selectedDate,
}: WorkoutDatePickerProps) => {
  return (
    <DatePicker
      label="Workout date"
      value={dayjs(selectedDate)}
      onChange={(newValue: Dayjs | null) => {
        if (newValue) {
          onDateSelect(newValue.toDate());
        }
      }}
    />
  );
};
