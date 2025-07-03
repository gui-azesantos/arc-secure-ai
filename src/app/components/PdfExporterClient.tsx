// components/PdfExporterClient.tsx
"use client";

import html2canvas from "html2canvas"; // Importe html2canvas diretamente
import { jsPDF } from "jspdf"; // Importe jsPDF diretamente
import React, { useState } from "react";

interface PdfExporterProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
  buttonText?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

export function PdfExporterClient({
  contentRef,
  filename = "relatorio-analise-seguranca.pdf",
  buttonText = "Exportar para PDF",
  buttonClassName = "",
  disabled = false,
}: PdfExporterProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  // Não precisamos mais de 'isLibReady' porque as libs são importadas diretamente
  // e seu carregamento é gerenciado pelo bundler.

  const handleExportPdf = async () => {
    if (!contentRef.current) {
      console.error(
        "DEBUG: Conteúdo para exportação não encontrado (contentRef.current é null)."
      );
      alert(
        "Erro: O conteúdo para exportação não foi encontrado. Certifique-se de que o relatório esteja visível."
      );
      return;
    }

    setIsGenerating(true);
    const element = contentRef.current;

    try {
      console.log("DEBUG: Iniciando captura do HTML com html2canvas...");
      const canvas = await html2canvas(element, {
        scale: 2, // Aumenta a resolução para melhor qualidade no PDF
        logging: true, // Mantenha TRUE para depuração
        useCORS: true, // Importante se houver imagens de outras origens
        windowWidth: element.scrollWidth, // Captura toda a largura do conteúdo
        windowHeight: element.scrollHeight, // Captura toda a altura do conteúdo
      });

      console.log(
        "DEBUG: html2canvas capturou o elemento. Criando PDF com jsPDF..."
      );
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Qualidade da imagem no PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calcula as dimensões para caber na página A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calcula a proporção para ajustar a imagem ao PDF
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Margem superior

      // Adiciona a imagem capturada ao PDF
      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      console.log("DEBUG: Salvando PDF...");
      pdf.save(filename); // Salva o arquivo PDF
      console.log("DEBUG: PDF gerado com sucesso!");
    } catch (error) {
      console.error("DEBUG: ERRO FINAL na geração do PDF:", error);
      alert(
        "Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExportPdf}
      disabled={disabled || isGenerating} // Agora só depende de 'disabled' do pai e 'isGenerating'
      className={`bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg
                  transition-colors duration-300 flex items-center justify-center
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${buttonClassName}`}
    >
      {isGenerating ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
          Gerando...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 8.586V3a1 1 0 112 0v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
}
