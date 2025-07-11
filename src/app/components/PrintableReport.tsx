/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/PrintableReport.tsx
"use client";

import React from "react";

// Define as props que este componente receberá (o relatório STRIDE e outros dados)
interface PrintableReportProps {
  strideReport: any[]; // O array de dados do relatório STRIDE
  getCriticidadeClass: (criticidade: string) => string; // Função para classes CSS da criticidade
  // Adicione outras props se o seu relatório precisar de mais dados de fora
}

// Usamos React.forwardRef para que este componente possa receber uma referência (ref)
// diretamente do componente pai (UploadPage)
const PrintableReport = React.forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ strideReport, getCriticidadeClass }, ref) => {
    return (
      // Este div é o elemento que será impresso
      <div ref={ref} className="space-y-8 p-4 bg-gray-800 rounded-lg">
        {strideReport.length > 0 ? (
          strideReport.map((comp: any, i: number) => (
            <div
              key={i}
              className="p-5 bg-gray-700 rounded-lg border border-gray-600 last:mb-0"
            >
              <h3 className="font-bold text-xl text-teal-300 mb-3">
                {comp.nome} (
                <span className="font-normal text-gray-400">{comp.tipo}</span>)
              </h3>
              {comp.sugestoesDeArquiteturaSegura &&
                comp.sugestoesDeArquiteturaSegura.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-600 rounded-md border border-gray-500">
                    <h4 className="font-semibold text-teal-200 mb-2">
                      Sugestões de Arquitetura Segura:
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                      {comp.sugestoesDeArquiteturaSegura.map(
                        (sug: string, sIdx: number) => (
                          <li key={sIdx}>{sug}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              <ul className="list-none space-y-4 mt-4">
                {comp.ameacas &&
                  comp.ameacas.map((a: any, j: number) => (
                    <li
                      key={j}
                      className="bg-gray-600 p-4 rounded-md shadow-sm border border-gray-500"
                    >
                      <p className="text-base mb-1">
                        <strong className="text-red-400">{a.categoria}:</strong>{" "}
                        <span className="text-gray-200">{a.descricao}</span>
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong className="text-gray-200">
                          Contramedidas:
                        </strong>{" "}
                        {a.contramedidas}
                        {/* O link para a Wiki pode ser removido no print se desejar, ou mantido */}
                      </p>
                      {a.criticidade && (
                        <p className="text-sm">
                          <strong className="text-gray-200">
                            Criticidade:
                          </strong>{" "}
                          <span className={getCriticidadeClass(a.criticidade)}>
                            {a.criticidade}
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            Nenhum relatório STRIDE gerado ainda.
          </p>
        )}
      </div>
    );
  }
);

PrintableReport.displayName = "PrintableReport"; // Bom para depuração em React DevTools

export default PrintableReport;
