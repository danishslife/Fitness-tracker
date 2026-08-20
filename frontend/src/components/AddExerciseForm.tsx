import { useState, type ChangeEvent } from "react";
import type { CreateExerciseData } from "../types/exercise";
import { createOneExercise } from "../ExerciseService";


interface AddExerciseFormProps {
  onSaveFailure: (error: string) => void;
  onSaveSuccess: () => void;
}


export const AddExerciseForm = ({onSaveFailure, onSaveSuccess}: AddExerciseFormProps) => {
  const [formData, setFormData] = useState<CreateExerciseData>({
    name: "",
    weight: 0,
    reps: 0
  });

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = async () => {
    if (formData.name && formData.weight && formData.reps) {
      try {
        setFormData({ name: "", weight: 0, reps: 0 });
        await createOneExercise(formData);
        onSaveSuccess();
      } catch (error) {
        onSaveFailure(error instanceof Error ? error.message : "Unknown error");
      }
    }
    else return
  };

  return (
    <div className="container">
      <div className="add-container">
        <div className="info-container">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
          />
          <input
            type="number"
            placeholder="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleFieldChange}
          />
          <input
            type="number"
            placeholder="Reps"
            name="reps"
            value={formData.reps}
            onChange={handleFieldChange}
          />
        </div>

        <button className="add" onClick={handleAddClick}>
          ADD
        </button>
      </div>
    </div>
  );
};
