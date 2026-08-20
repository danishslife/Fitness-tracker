import ReactCalendar from "react-calendar";
// Import the default clean styles provided by the library
import "react-calendar/dist/Calendar.css";

interface WorkoutCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const WorkoutCalendar = ({
  onDateSelect,
  selectedDate,
}: WorkoutCalendarProps) => {
  return (
    <div className="calendar-container">
      <ReactCalendar
        // Highlights the currently selected date
        value={selectedDate}
        // Triggers instantly whenever a user clicks any day block
        onChange={(value) => {
          if (value instanceof Date) {
            onDateSelect(value);
          }
        }}
        // Disables the view from going into decade/century mode if you only want months
        maxDetail="month"
        minDetail="month"
      />
    </div>
  );
}
