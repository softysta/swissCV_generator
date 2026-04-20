import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface SkillsFieldProps {
  name: string;
  label?: string;
}

export function SkillsField({ name, label }: SkillsFieldProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const skills = watch(name) || [];
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      append(newSkill);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    remove(index);
  };

  return (
    <div className="mt-6 pt-6 border-t border-zinc-200">
      {label && (
        <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
          {label}
        </Label>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.length === 0 ? (
          <p className="text-sm text-zinc-500">No skills added</p>
        ) : (
          skills.map((skill: string, index: number) => (
            <Badge
              key={index}
              className="bg-blue-100 text-blue-700 border-0 px-3 py-1 flex items-center gap-2 cursor-pointer hover:bg-blue-200"
            >
              {skill}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeSkill(index)}
              />
            </Badge>
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
