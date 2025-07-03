"use client";

import { useCallback, useState } from "react";

export function ImageUploader({
  onImageSelected,
  selectedFile,
  onFileRemoved,
  disabled = false,
}: {
  onImageSelected: (file: File) => void;
  selectedFile: File | null;
  onFileRemoved: () => void;
  disabled?: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        onImageSelected(file);
      }
    },
    [onImageSelected, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 h-64 flex flex-col justify-center items-center
        ${
          isDragOver
            ? "border-teal-500 bg-gray-700/50"
            : "border-gray-600 bg-gray-700/30"
        }
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-teal-500 transition-colors duration-300 group cursor-pointer"
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() =>
        !disabled && document.getElementById("file-input")?.click()
      }
    >
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {previewUrl && (
        <>
          <img
            src={previewUrl}
            alt="Preview do Diagrama"
            className="absolute inset-0 w-full h-full object-cover rounded-lg z-0"
          />
          <div className="absolute inset-0 bg-gray-950/70 rounded-lg z-10 flex items-center justify-center">
            <p className="text-center text-lg font-semibold text-teal-300 relative z-20">
              Arquivo pronto:{" "}
              <span className="block text-xl font-bold">
                {selectedFile?.name}
              </span>
              <span className="block text-sm text-gray-400">
                (
                {selectedFile && typeof selectedFile.size === "number"
                  ? (selectedFile.size / 1024 / 1024).toFixed(2)
                  : "0.00"}{" "}
                MB)
              </span>
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileRemoved();
            }}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center text-sm z-30"
            title="Remover arquivo"
            disabled={disabled}
          >
            &times;
          </button>
        </>
      )}

      {!selectedFile && (
        <>
          <div className="flex flex-col items-center justify-center relative z-10 pointer-events-none">
            <span
              className={`text-gray-600 text-6xl opacity-50 mb-2 ${
                isDragOver ? "text-teal-400" : "group-hover:text-teal-400"
              } transition-colors duration-300`}
            >
              🖼️
            </span>
            <p className="text-sm text-gray-400">
              Arraste e solte sua imagem aqui, ou{" "}
              <span className="text-teal-400 font-semibold cursor-pointer">
                clique para selecionar
              </span>
              .
            </p>
            <span className="text-xs mt-2 block text-gray-500">
              Formatos suportados: JPG, PNG, SVG.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
