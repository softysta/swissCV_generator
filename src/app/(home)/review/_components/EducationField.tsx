import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "./FormInput";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

interface EducationFieldProps {
  name: string;
  label?: string;
}

export function EducationField({ name, label }: EducationFieldProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const educations = watch(name) || [];

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
    };
    append(newEdu);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {label && (
          <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
            {label}
          </Label>
        )}
        <Button
          type="button"
          onClick={addEducation}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No education - extracted data will appear here</p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 bg-zinc-50 rounded-lg border border-zinc-200"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  name={`${name}.${index}.school`}
                  label="School/University"
                  placeholder="School/University"
                />
                <FormInput
                  name={`${name}.${index}.degree`}
                  label="Degree"
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  name={`${name}.${index}.field`}
                  label="Field of Study"
                  placeholder="Field of Study"
                />
                <FormInput
                  name={`${name}.${index}.graduationDate`}
                  label="Graduation Date"
                  placeholder="YYYY"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
