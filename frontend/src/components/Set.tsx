import { useEffect, useRef, useState } from "react";
import { deleteOneExercise, updateOneExercise } from "../ExerciseService";
import type { Exercise, UpdateExerciseData } from "../types/exercise";
import type { FocusEvent } from "react";
import { UpsertSetDialog } from "../components/UpsertSetDialog";
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface WorkoutCardProps {
  onSaveFailure: (error: string) => void;
  onEditSuccess: () => void;
  onDeleteSuccess: () => void;
  onSaveSuccess: () => void;
  exercise: Exercise[];
}

export const WorkoutCard = ({
  onSaveFailure,
  onEditSuccess,
  onDeleteSuccess,
  onSaveSuccess,
  exercise,
}: WorkoutCardProps) => {
  const [editId, setEditId] = useState<string | false>(false);
  const outsideClick = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!editId) return;

    const selectedItem = document.querySelectorAll(`[id='${editId}']`);
    (selectedItem[0] as HTMLElement | undefined)?.focus();
  }, [editId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outsideClick.current &&
        event.target instanceof Node &&
        !outsideClick.current.contains(event.target)
      ) {
        setEditId(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteOneExercise(id);
      onDeleteSuccess();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleEdit = async (id: string, updatedData: UpdateExerciseData) => {
    if (!editId || editId !== id) {
      return;
    }
    try {
      await updateOneExercise(
        id,
        // updatedData.exerciseCatalog,
        updatedData.weight,
        updatedData.reps,
      );
      onEditSuccess();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
    }
  };

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

      <Stack
        direction="column"
        spacing={0}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {exercise.map((item) => (
          <Accordion key={item._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${item._id}-panel1-content`}
              id={`${item._id}-panel1-header`}
            >
              <Typography component="span">
                {item.exerciseCatalog?.name ?? ""}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          
          // <tr key={item._id}>
          //   <td>{item.exerciseCatalog?.name ?? ""}</td>
          //   <td
          //     id={item._id}
          //     contentEditable={editId === item._id}
          //     onBlur={(e: FocusEvent<HTMLTableCellElement>) =>
          //       handleEdit(item._id, {
          //         weight: Number(e.currentTarget.textContent),
          //       })
          //     }
          //   >
          //     {item.weight}
          //   </td>
          //   <td
          //     contentEditable={editId === item._id}
          //     onBlur={(e: FocusEvent<HTMLTableCellElement>) =>
          //       handleEdit(item._id, {
          //         reps: Number(e.currentTarget.innerText),
          //       })
          //     }
          //   >
          //     {item.reps}
          //   </td>
          //   <td className="actions">
          //     <button className="edit" onClick={() => setEditId(item._id)}>
          //       Edit
          //     </button>
          //     <button className="delete" onClick={() => handleDelete(item._id)}>
          //       Delete
          //     </button>
          //   </td>
          // </tr>
        ))}
      </Stack>
    </CardContent>
  );
};
