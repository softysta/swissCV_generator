import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function FormInput({
  name,
  label,
  placeholder,
  type = "text",
  required,
}: FormInputProps) {
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
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className="bg-zinc-50 border-zinc-200"
          />
        </div>
      )}
    />
  );
}
