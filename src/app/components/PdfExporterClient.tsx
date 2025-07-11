/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/PdfExporterClient.tsx
"use client";

import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#1a202c",
    padding: 30,
    fontFamily: "Helvetica",
    color: "#ffffff",
  },
  section: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#2d3748",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a5568",
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    color: "#6ee7b7",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 8,
    color: "#6ee7b7",
    fontWeight: "bold",
  },
  componentName: {
    fontSize: 16,
    color: "#4fd1c5",
    fontWeight: "bold",
    marginBottom: 5,
  },
  componentType: {
    fontSize: 12,
    color: "#a0aec0",
    marginBottom: 10,
  },
  threatCategory: {
    fontSize: 14,
    color: "#f87171",
    fontWeight: "bold",
  },
  threatDescription: {
    fontSize: 12,
    color: "#e2e8f0",
    marginBottom: 5,
  },
  countermeasures: {
    fontSize: 11,
    color: "#cbd5e0",
    marginBottom: 5,
  },
  criticidade: {
    fontSize: 11,
    fontWeight: "bold",
  },
  sugestoesContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#4a5568",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#718096",
  },
  sugestoesHeader: {
    fontSize: 12,
    color: "#81e6d9",
    fontWeight: "bold",
    marginBottom: 5,
  },
  sugestoesText: {
    fontSize: 10,
    color: "#a0aec0",
  },
  criticidadeCritica: { color: "#ef4444" },
  criticidadeAlta: { color: "#fb923c" },
  criticidadeMedia: { color: "#facc15" },
  criticidadeBaixa: { color: "#34d399" },
  criticidadeDefault: { color: "#a0aec0" },
});

const StrideReportDocument = ({ strideReport }: any) => {
  const getCriticidadeStyle = (criticidade: string) => {
    switch (criticidade?.toLowerCase()) {
      case "crítica":
        return styles.criticidadeCritica;
      case "alta":
        return styles.criticidadeAlta;
      case "média":
        return styles.criticidadeMedia;
      case "baixa":
        return styles.criticidadeBaixa;
      default:
        return styles.criticidadeDefault;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Relatório de Análise de Segurança STRIDE
        </Text>
        <Text
          style={{
            fontSize: 10,
            marginBottom: 20,
            textAlign: "center",
            color: "#a0aec0",
          }}
        >
          Gerado pelo ArcSecure AI
        </Text>

        {strideReport.map((comp: any, i: number) => (
          <View key={i} style={styles.section}>
            <Text style={styles.componentName}>{comp.nome} </Text>
            <Text style={styles.componentType}>Tipo: {comp.tipo}</Text>

            {comp.sugestoesDeArquiteturaSegura &&
              comp.sugestoesDeArquiteturaSegura.length > 0 && (
                <View style={styles.sugestoesContainer}>
                  <Text style={styles.sugestoesHeader}>
                    Sugestões de Arquitetura Segura:
                  </Text>
                  {comp.sugestoesDeArquiteturaSegura.map(
                    (sug: string, sIdx: number) => (
                      <Text key={sIdx} style={styles.sugestoesText}>
                        • {sug}
                      </Text>
                    )
                  )}
                </View>
              )}

            <Text style={styles.subHeader}>Ameaças:</Text>
            {comp.ameacas &&
              comp.ameacas.map((ameaca: any, j: number) => (
                <View
                  key={j}
                  style={{
                    marginBottom: 10,
                    padding: 5,
                    backgroundColor: "#4a5568",
                    borderRadius: 4,
                  }}
                >
                  <Text>
                    <Text style={styles.threatCategory}>
                      {ameaca.categoria}:{" "}
                    </Text>
                    <Text style={styles.threatDescription}>
                      {ameaca.descricao}
                    </Text>
                  </Text>
                  <Text style={styles.countermeasures}>
                    Contramedidas: {ameaca.contramedidas}
                  </Text>
                  {ameaca.criticidade && (
                    <Text
                      style={{
                        ...styles.criticidade,
                        ...getCriticidadeStyle(ameaca.criticidade),
                      }}
                    >
                      Criticidade: {ameaca.criticidade}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

interface PdfExporterClientProps {
  strideReport: any[];
  fileName: string;
  getCriticidadeClass: (criticidade: string) => string;
}

const PdfExporterClient: React.FC<PdfExporterClientProps> = ({
  strideReport,
  fileName,
  getCriticidadeClass,
}) => {
  if (!strideReport || strideReport.length === 0) {
    return (
      <button
        className="py-1 px-3 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        title="Gere um relatório para exportar"
      >
        PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <StrideReportDocument
          strideReport={strideReport}
          getCriticidadeClass={getCriticidadeClass}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          className="py-1 px-3 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
          title="Exportar para PDF"
          disabled={loading}
        >
          {loading ? "Gerando PDF..." : "PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PdfExporterClient;
