import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  required,
  rows = 4,
}: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          {label && (
            <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1 block">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          <Textarea
            {...field}
            placeholder={placeholder}
            className="bg-zinc-50 border-zinc-200"
            style={{ minHeight: `${rows * 1.5}rem` }}
          />
        </div>
      )}
    />
  );
}
