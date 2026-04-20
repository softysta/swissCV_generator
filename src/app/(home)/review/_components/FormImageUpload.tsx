import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormImageUploadProps {
  name: string;
  label?: string;
}

export function FormImageUpload({ name, label }: FormImageUploadProps) {
  const { control, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="flex flex-col items-center">
          {label && (
            <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block w-full text-center">
              {label}
            </Label>
          )}

          <div
            className="w-32 h-32 mb-4 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-blue-100 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            {value ? (
              <img
                src={value}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-xs text-blue-600 font-medium">Add photo</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const result = event.target?.result as string;
                  // Use setValue to ensure proper form state update
                  setValue(name, result, { shouldDirty: true });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />

          {value ? (
            <button
              type="button"
              onClick={() => {
                setValue(name, null, { shouldDirty: true });
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium mb-2"
            >
              Remove Photo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
            >
              Upload Photo
            </button>
          )}
          <p className="text-xs text-zinc-500">JPG or PNG, max 5MB</p>
        </div>
      )}
    />
  );
}
