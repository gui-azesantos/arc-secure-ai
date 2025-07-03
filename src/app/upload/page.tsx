/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ImageUploader } from "../components/ImageUploader"; // Assumindo que ImageUploader está bem estilizado internamente
import { extractComponentsFromImage } from "../lib/gpt";
import { generateStrideReport } from "../lib/stride";

// Componente de Skeleton para simular o carregamento
const SkeletonLoader = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded"></div>
    ))}
  </div>
);

// Componente de Skeleton para o relatório STRIDE
const StrideSkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="p-5 bg-gray-100 rounded-lg border border-gray-200"
      >
        <div className="h-6 bg-blue-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const [strideReport, setStrideReport] = useState<any[]>([]);
  const [loadingOverall, setLoadingOverall] = useState(false); // Loading geral do botão
  const [loadingComponents, setLoadingComponents] = useState(false); // Loading para componentes detectados
  const [loadingStride, setLoadingStride] = useState(false); // Loading para relatório STRIDE
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione uma imagem para analisar.");
      return;
    }

    console.log("Processando arquivo:", selectedFile.name);

    setLoadingOverall(true);
    setLoadingComponents(true); // Inicia loading para componentes
    setLoadingStride(true); // Inicia loading para STRIDE

    setResult([]);
    setStrideReport([]);
    setError(null);

    try {
      // Processamento dos componentes
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
      setLoadingComponents(false); // Componentes carregados

      // Processamento do relatório STRIDE
      const stride = await generateStrideReport(components);
      setStrideReport(stride);
      setLoadingStride(false); // STRIDE carregado
    } catch (err) {
      setError(
        "Ocorreu um erro ao processar a imagem ou gerar o relatório. Tente novamente."
      );
      console.error("Erro detalhado:", err);
      setLoadingComponents(false); // Garante que os loadings sejam desativados em caso de erro
      setLoadingStride(false);
    } finally {
      setLoadingOverall(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      {/* Header com título e uma breve descrição */}
      <header className="w-full max-w-4xl text-center mb-10 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-blue-900 drop-shadow-sm">
          Análise de Arquitetura de Segurança
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Faça upload de um diagrama de arquitetura e nossa IA o ajudará a
          identificar vulnerabilidades de segurança usando o modelo STRIDE.
        </p>
      </header>

      {/* Primeiro Bloco: Upload e Processamento */}
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-xl border border-gray-200 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Envie seu Diagrama
        </h2>
        <ImageUploader onImageSelected={setSelectedFile} />

        {selectedFile && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Arquivo selecionado:{" "}
            <span className="font-semibold">{selectedFile.name}</span>
          </p>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <button
          onClick={handleProcess}
          disabled={loadingOverall || !selectedFile}
          className="mt-8 w-full bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
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

      {/* Segundo Bloco: Resultados (Componentes e STRIDE lado a lado) */}
      {(loadingOverall || result.length > 0 || strideReport.length > 0) && (
        <section className="w-full max-w-6xl animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-8">
            {" "}
            {/* Flexbox para lado a lado */}
            {/* Coluna de Componentes Detectados */}
            <div className="flex-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3 border-gray-200">
                Componentes Detectados
              </h2>
              {loadingComponents ? (
                <SkeletonLoader lines={5} /> // Exibe skeleton enquanto carrega
              ) : result.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {" "}
                  {/* Removi o grid md:grid-cols-2 aqui para ficar mais compacto na coluna */}
                  {result.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-blue-700 mb-1">
                        {comp.nome}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong className="text-gray-700">Tipo:</strong>{" "}
                        {comp.tipo}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comp.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  Nenhum componente detectado ainda.
                </p>
              )}
            </div>
            {/* Coluna de Relatório STRIDE */}
            <div className="flex-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-5 text-blue-800 border-b pb-3 border-gray-200">
                Relatório de Ameaças STRIDE
              </h2>
              {loadingStride ? (
                <StrideSkeletonLoader /> // Exibe skeleton mais robusto para STRIDE
              ) : strideReport.length > 0 ? (
                <div className="space-y-8">
                  {" "}
                  {/* Usei space-y para espaçamento entre os componentes do STRIDE */}
                  {strideReport.map((comp, i) => (
                    <div
                      key={i}
                      className="p-5 bg-gray-50 rounded-lg border border-gray-100 last:mb-0"
                    >
                      <h3 className="font-bold text-xl text-blue-700 mb-3">
                        {comp.nome} (
                        <span className="font-normal text-gray-600">
                          {comp.tipo}
                        </span>
                        )
                      </h3>
                      <ul className="list-none space-y-4">
                        {comp.ameacas.map((a: any, j: number) => (
                          <li
                            key={j}
                            className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                          >
                            <p className="text-base mb-1">
                              <strong className="text-red-600">
                                {a.categoria}:
                              </strong>{" "}
                              <span className="text-gray-800">
                                {a.descricao}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong className="text-gray-700">
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
                <p className="text-gray-600 text-center py-8">
                  Nenhum relatório STRIDE gerado ainda.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Adicionar animações de fade-in com CSS simples para um toque visual */}
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
