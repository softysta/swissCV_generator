import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceFieldProps {
  name: string;
  label?: string;
}

export function ExperienceField({
  name,
  label,
}: ExperienceFieldProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const experiences = watch(name) || [];

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    append(newExp);
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
          onClick={addExperience}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No experiences - extracted data will appear here</p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 bg-zinc-50 rounded-lg border border-zinc-200"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  name={`${name}.${index}.title`}
                  label="Job Title"
                  placeholder="Job Title"
                />
                <FormInput
                  name={`${name}.${index}.company`}
                  label="Company"
                  placeholder="Company"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput
                  name={`${name}.${index}.startDate`}
                  label="Start Date"
                  placeholder="MM/YYYY"
                />
                <FormInput
                  name={`${name}.${index}.endDate`}
                  label="End Date"
                  placeholder="MM/YYYY or Present"
                />
              </div>

              <FormTextarea
                name={`${name}.${index}.description`}
                label="Description"
                placeholder="Job description and responsibilities"
                rows={3}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 flex items-center gap-1"
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
