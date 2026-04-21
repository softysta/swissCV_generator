import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext, useController } from "react-hook-form";

interface SkillsFieldProps {
  name: string;
  label?: string;
}

export function SkillsField({ name, label }: SkillsFieldProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      append(newSkill);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    remove(indexToRemove);
  };

  return (
    <div className="mt-6 pt-6 border-t border-zinc-200">
      {label && (
        <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
          {label}
        </Label>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {fields.length === 0 ? (
          <p className="text-sm text-zinc-500">No skills added</p>
        ) : (
          fields.map((field, idx) => (
            <SkillBadge
              key={field.id}
              name={`${name}.${idx}`}
              skillIndex={idx}
              onRemove={handleRemoveSkill}
            />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill..."
          className="bg-zinc-50 border-zinc-200"
          onKeyPress={(e) => e.key === "Enter" && addSkill()}
        />
        <Button
          type="button"
          onClick={addSkill}
          variant="outline"
          className="px-4"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function SkillBadge({ name, skillIndex, onRemove }: { name: string; skillIndex: number; onRemove: (idx: number) => void }) {
  const { watch } = useFormContext();
  const skill = watch(name);

  return (
    <Badge
      className="bg-blue-100 text-blue-700 border-0 px-3 py-1 flex items-center gap-2"
    >
      {skill || ""}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(skillIndex);
        }}
        className="ml-1 hover:opacity-70 transition-opacity flex items-center justify-center"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
