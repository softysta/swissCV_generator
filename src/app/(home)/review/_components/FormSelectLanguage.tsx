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
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const [newLanguage, setNewLanguage] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState<"Native" | "Fluent" | "Intermediate" | "Basic">("Fluent");

  const addLanguage = () => {
    if (newLanguage.trim()) {
      append({ name: newLanguage, proficiency: selectedProficiency });
      setNewLanguage("");
      setSelectedProficiency("Fluent");
    }
  };

  const handleRemoveLanguage = (indexToRemove: number) => {
    remove(indexToRemove);
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
        {fields.length === 0 ? (
          <p className="text-sm text-zinc-500">No languages added</p>
        ) : (
          fields.map((field, idx) => (
            <LanguageBadge
              key={field.id}
              name={name}
              languageIndex={idx}
              onRemove={handleRemoveLanguage}
            />
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

function LanguageBadge({ name, languageIndex, onRemove }: { name: string; languageIndex: number; onRemove: (idx: number) => void }) {
  const { watch } = useFormContext();
  const langName = watch(`${name}.${languageIndex}.name`);
  const langProficiency = watch(`${name}.${languageIndex}.proficiency`);

  return (
    <Badge
      className="bg-blue-100 text-blue-700 border-0 px-3 py-1.5 flex items-center gap-2"
    >
      <span>
        {langName} <span className="text-xs opacity-75">({langProficiency})</span>
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(languageIndex);
        }}
        className="ml-1 hover:opacity-70 transition-opacity flex items-center justify-center"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
