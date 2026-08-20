import { useEffect, useRef, useState } from "react";
import { deleteOneExercise, updateOneExercise } from "../ExerciseService";
import type { Exercise, UpdateExerciseData } from "../types/exercise";
import type { FocusEvent } from "react";

interface DataTableProps {
  onSaveFailure: (error: string) => void;
  onEditSuccess: () => void;
  onDeleteSuccess: () => void;
  exercise: Exercise[];
}

export const DataTable = ({
  onSaveFailure,
  onEditSuccess,
  onDeleteSuccess,
  exercise
}: DataTableProps) => {
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
        updatedData.name,
        updatedData.weight,
        updatedData.reps,
      );
      onEditSuccess();
    } catch (error) {
      onSaveFailure(error instanceof Error ? error.message : "Unknown error");
    }
  };
  return (
    <div className="search-table-container">
      <table ref={outsideClick}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {exercise.map((item) => (
            <tr key={item._id}>
              <td
                id={item._id}
                contentEditable={editId === item._id}
                onBlur={(e: FocusEvent<HTMLTableCellElement>) =>
                  handleEdit(item._id, { name: e.currentTarget.innerText })
                }
              >
                {item.name}
              </td>
              <td
                contentEditable={editId === item._id}
                onBlur={(e: FocusEvent<HTMLTableCellElement>) =>
                  handleEdit(item._id, {
                    weight: Number(e.currentTarget.textContent),
                  })
                }
              >
                {item.weight}
              </td>
              <td
                contentEditable={editId === item._id}
                onBlur={(e: FocusEvent<HTMLTableCellElement>) =>
                  handleEdit(item._id, {
                    reps: Number(e.currentTarget.innerText),
                  })
                }
              >
                {item.reps}
              </td>
              <td className="actions">
                <button className="edit" onClick={() => setEditId(item._id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
