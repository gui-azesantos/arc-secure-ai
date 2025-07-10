// app/upload/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { ImageUploader } from "../components/ImageUploader";
import { PdfExporter } from "../components/PdfExporter";
import { extractComponentsFromImage } from "../lib/gpt";
import { generateStrideReport } from "../lib/stride";

const SkeletonLoader = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-700 rounded"></div>
    ))}
  </div>
);

const StrideSkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="p-5 bg-gray-800 rounded-lg border border-gray-700"
      >
        <div className="h-6 bg-teal-800 rounded w-3/4 mb-3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-11/12"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const [strideReport, setStrideReport] = useState<any[]>([]);
  const [loadingOverall, setLoadingOverall] = useState(false);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [loadingStride, setLoadingStride] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strideReportRef = useRef<HTMLDivElement>(null);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult([]);
    setStrideReport([]);
    setError(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione uma imagem para analisar.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Formato de arquivo inválido. Por favor, use JPEG, PNG ou SVG.");
      setSelectedFile(null);
      return;
    }

    console.log("Processando arquivo:", selectedFile.name);

    setLoadingOverall(true);
    setLoadingComponents(true);
    setLoadingStride(true);

    setResult([]);
    setStrideReport([]);
    setError(null);

    try {
      const componentResult = await extractComponentsFromImage(selectedFile);
      let components: any[] = [];

      if (Array.isArray(componentResult)) {
        components = componentResult;
      } else if (componentResult && componentResult.raw) {
        const jsonString = componentResult.raw
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
        components = JSON.parse(jsonString);
      } else {
        throw new Error(
          "Formato de resposta inesperado da IA para componentes."
        );
      }
      setResult(components);
      setLoadingComponents(false);

      const stride = await generateStrideReport(components);
      setStrideReport(stride);
      setLoadingStride(false);
    } catch (err) {
      setError(
        "Ocorreu um erro ao processar a imagem ou gerar o relatório. Verifique o formato e a qualidade da imagem e tente novamente."
      );
      console.error("Erro detalhado:", err);
      setLoadingComponents(false);
      setLoadingStride(false);
    } finally {
      setLoadingOverall(false);
    }
  };

  const MAX_WIDTH_CLASS = "max-w-6xl";

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gray-950 font-sans text-gray-100">
      <header className={`w-full ${MAX_WIDTH_CLASS} text-center mb-10 mt-8`}>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-teal-400 drop-shadow-sm">
          Análise de Arquitetura de Segurança
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Faça upload de um diagrama de arquitetura e nossa IA o ajudará a
          identificar vulnerabilidades de segurança usando o modelo STRIDE.
        </p>
      </header>

      <section
        className={`bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full ${MAX_WIDTH_CLASS} border border-gray-700 mb-12`}
      >
        <h2 className="text-2xl font-bold mb-6 text-teal-400 text-center">
          Envie seu Diagrama de Arquitetura ⬆️
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center text-gray-300">
          <div className="flex flex-col items-center p-3 rounded-md bg-gray-700/40 border border-gray-700">
            <span className="text-teal-300 text-3xl mb-2">✨</span>
            <p className="font-semibold mb-1">Qualidade da Imagem</p>
            <p className="text-sm text-gray-400">
              Certifique-se de que a imagem seja de **alta qualidade** e nítida
              para melhor detecção.
            </p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-md bg-gray-700/40 border border-gray-700">
            <span className="text-teal-300 text-3xl mb-2">📁</span>
            <p className="font-semibold mb-1">Formatos Suportados</p>
            <p className="text-sm text-gray-400">
              Aceitamos **JPEG, PNG e SVG**. Escolha o formato que melhor
              preserve os detalhes.
            </p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-md bg-gray-700/40 border border-gray-700">
            <span className="text-teal-300 text-3xl mb-2">🔍</span>
            <p className="font-semibold mb-1">Diagramas Otimizados</p>
            <p className="text-sm text-gray-400">
              **Diagramas claros** com componentes bem definidos otimizam a
              precisão da IA.
            </p>
          </div>
        </div>

        <ImageUploader
          onImageSelected={setSelectedFile}
          selectedFile={selectedFile}
          onFileRemoved={handleRemoveFile}
          disabled={loadingOverall}
        />

        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <button
          onClick={handleProcess}
          disabled={loadingOverall || !selectedFile}
          className="mt-8 w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loadingOverall ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analisando...
            </>
          ) : (
            "Analisar Imagem"
          )}
        </button>
      </section>

      {(loadingOverall || result.length > 0 || strideReport.length > 0) && (
        <section className={`w-full ${MAX_WIDTH_CLASS} animate-fade-in`}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-5 text-teal-400 border-b pb-3 border-gray-700">
                Componentes Detectados
              </h2>
              {loadingComponents ? (
                <SkeletonLoader lines={5} />
              ) : result.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {result.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-teal-300 mb-1">
                        {comp.nome}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        <strong className="text-gray-200">Tipo:</strong>{" "}
                        {comp.tipo}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {comp.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Nenhum componente detectado ainda.
                </p>
              )}
            </div>

            <div className="flex-1 bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-5 border-b pb-3 border-gray-700">
                <h2 className="text-2xl font-bold text-teal-400">
                  Relatório de Ameaças STRIDE
                </h2>
                {strideReport.length > 0 && (
                  <PdfExporter
                    contentRef={strideReportRef}
                    filename="relatorio-stride-seguranca.pdf"
                    buttonText="Exportar PDF"
                    disabled={loadingStride}
                  />
                )}
              </div>
              {loadingStride ? (
                <StrideSkeletonLoader />
              ) : strideReport.length > 0 ? (
                <div
                  ref={strideReportRef}
                  className="space-y-8 p-4 bg-gray-800 rounded-lg"
                >
                  {" "}
                  {strideReport.map((comp, i) => (
                    <div
                      key={i}
                      className="p-5 bg-gray-700 rounded-lg border border-gray-600 last:mb-0"
                    >
                      <h3 className="font-bold text-xl text-teal-300 mb-3">
                        {comp.nome} (
                        <span className="font-normal text-gray-400">
                          {comp.tipo}
                        </span>
                        )
                      </h3>
                      <ul className="list-none space-y-4">
                        {comp.ameacas.map((a: any, j: number) => (
                          <li
                            key={j}
                            className="bg-gray-600 p-4 rounded-md shadow-sm border border-gray-500"
                          >
                            <p className="text-base mb-1">
                              <strong className="text-red-400">
                                {a.categoria}:
                              </strong>{" "}
                              <span className="text-gray-200">
                                {a.descricao}
                              </span>
                            </p>
                            <p className="text-sm text-gray-300">
                              <strong className="text-gray-200">
                                Contramedidas:
                              </strong>{" "}
                              {a.contramedidas}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Nenhum relatório STRIDE gerado ainda.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
