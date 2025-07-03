/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { extractComponentsFromImage } from "../lib/gpt";
import { useState } from "react";
import { ImageUploader } from "../components/ImageUploader";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const data = await extractComponentsFromImage(selectedFile);
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Análise de Arquitetura</h1>
      <ImageUploader onImageSelected={setSelectedFile} />
      <button
        onClick={handleProcess}
        disabled={!selectedFile}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Analisar Imagem
      </button>

      {loading && <p className="mt-4">⏳ Analisando com IA...</p>}
      {result && (
        <pre className="mt-6 bg-gray-100 p-4 rounded w-full max-w-2xl text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
