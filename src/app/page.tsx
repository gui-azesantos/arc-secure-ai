"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans py-16">
      <header className="container mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-teal-400 mb-4 animate-pulse">
          🛡️🕵️‍♂️ ArchSecure AI - Analise a Segurança da sua Arquitetura com IA
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Detecte vulnerabilidades de segurança em seus diagramas de arquitetura
          usando Inteligência Artificial e o poder do STRIDE.
        </p>
        <Link
          href="/upload"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
        >
          Começar a Análise <span aria-hidden="true">🚀</span>
        </Link>
      </header>

      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-semibold text-teal-400 text-center mb-8">
          Como Funciona? <span aria-hidden="true">⚙️</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 text-center">
            <div className="text-teal-300 text-4xl mb-4">
              <span>📤</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              1. Envie seu Diagrama
            </h3>
            <p className="text-gray-300 text-sm">
              Selecione e faça upload do seu diagrama de arquitetura (imagem).
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 text-center">
            <div className="text-teal-300 text-4xl mb-4">
              <span>🧠</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              2. Análise Inteligente
            </h3>
            <p className="text-gray-300 text-sm">
              Nossa IA identifica os componentes e analisa potenciais
              vulnerabilidades.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 text-center">
            <div className="text-teal-300 text-4xl mb-4">
              {/* Ícone de Relatório */}
              <span>📄</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              3. Receba seu Relatório STRIDE
            </h3>
            <p className="text-gray-300 text-sm">
              Visualize um relatório detalhado com ameaças STRIDE e
              contramedidas sugeridas.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12 bg-gray-900 rounded-lg shadow-md border border-gray-800 mt-16">
        <h2 className="text-3xl font-semibold text-teal-400 text-center mb-8">
          Por que usar nossa ferramenta? <span aria-hidden="true">💡</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de Detecção Precoce */}
              <span>🔍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Detecção Precoce
            </h3>
            <p className="text-gray-300 text-sm">
              Identifique falhas de segurança na fase de design, antes da
              implementação.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de STRIDE */}
              <span>🛡️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Análise Baseada em STRIDE
            </h3>
            <p className="text-gray-300 text-sm">
              Utiliza a metodologia STRIDE para uma análise abrangente de
              ameaças.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de Inteligência Artificial */}
              <span>🤖</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Poder da Inteligência Artificial
            </h3>
            <p className="text-gray-300 text-sm">
              A IA acelera a identificação de componentes e potenciais riscos de
              segurança.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de Melhoria Contínua */}
              <span>📈</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Melhore sua Postura de Segurança
            </h3>
            <p className="text-gray-300 text-sm">
              Obtenha insights valiosos para construir arquiteturas mais
              seguras.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de Facilidade de Uso */}
              <span>🖱️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Interface Intuitiva
            </h3>
            <p className="text-gray-300 text-sm">
              Fácil de usar, sem necessidade de conhecimentos técnicos avançados
              em análise de segurança.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="text-cyan-400 text-3xl mb-3">
              {/* Ícone de Economia de Tempo */}
              <span>⏱️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">
              Economize Tempo e Recursos
            </h3>
            <p className="text-gray-300 text-sm">
              Automatize a análise inicial e foque em resolver as
              vulnerabilidades críticas.
            </p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto text-center mt-16 py-8 text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} ArchSecure AI. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
