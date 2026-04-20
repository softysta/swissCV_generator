import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";

interface Language {
  name: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

interface FormSelectLanguageProps {
  name: string;
  label?: string;
}

const proficiencyLevels = ["Native", "Fluent", "Intermediate", "Basic"] as const;

export function FormSelectLanguage({
  name,
  label,
}: FormSelectLanguageProps) {
  const { control, watch } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const languages = watch(name) || [];
  const [newLanguage, setNewLanguage] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState<"Native" | "Fluent" | "Intermediate" | "Basic">("Fluent");

  const addLanguage = () => {
    if (newLanguage.trim()) {
      append({ name: newLanguage, proficiency: selectedProficiency });
      setNewLanguage("");
      setSelectedProficiency("Fluent");
    }
  };

  const removeLanguage = (index: number) => {
    remove(index);
  };

  return (
    <div>
      {label && (
        <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
          {label}
        </Label>
      )}

      {/* Display Languages */}
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.length === 0 ? (
          <p className="text-sm text-zinc-500">No languages added</p>
        ) : (
          languages.map((lang: Language, index: number) => (
            <Badge
              key={index}
              className="bg-blue-100 text-blue-700 border-0 px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-blue-200"
            >
              <span>
                {lang.name} <span className="text-xs opacity-75">({lang.proficiency})</span>
              </span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeLanguage(index)}
              />
            </Badge>
          ))
        )}
      </div>

      {/* Add Language */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add language..."
            className="bg-zinc-50 border-zinc-200 flex-1"
            onKeyPress={(e) => e.key === "Enter" && addLanguage()}
          />
          <Button
            type="button"
            onClick={addLanguage}
            variant="outline"
            className="px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <select
          value={selectedProficiency}
          onChange={(e) =>
            setSelectedProficiency(
              e.target.value as "Native" | "Fluent" | "Intermediate" | "Basic"
            )
          }
          className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm"
        >
          {proficiencyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
