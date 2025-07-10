# 🛡️ ArcSecure AI: Análise de Segurança de Arquitetura com IA

## 🚀 Sobre o Projeto

O **ArcSecure AI** é um projeto desenvolvido como parte do curso de Pós-Graduação em Inteligência Artificial da FIAP. Ele explora a aplicação de técnicas de IA para aprimorar a segurança de sistemas, focando na **análise automatizada de diagramas de arquitetura de software**.

A ferramenta visa identificar proativamente vulnerabilidades de segurança utilizando o reconhecido modelo **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege), oferecendo uma abordagem inovadora para fortalecer a resiliência de aplicações desde as etapas iniciais de design.

Este projeto demonstra a capacidade da IA em **automatizar e escalar processos complexos de segurança**, tornando a análise de ameaças mais acessível e eficiente para arquitetos, desenvolvedores e profissionais de segurança.

---

## ✨ Funcionalidades

- **Análise de Diagramas por IA**: Faça upload de diagramas de arquitetura (JPEG, PNG, SVG) para que a IA identifique os componentes do sistema e suas interações.
- **Detecção de Componentes**: Reconhecimento automático e classificação de elementos como servidores, bancos de dados, gateways, filas e serviços externos.
- **Relatório de Ameaças STRIDE**: Geração de um relatório detalhado que mapeia ameaças de segurança específicas para cada componente identificado.
- **Contramedidas Sugeridas**: Sugestões práticas de mitigação de riscos para cada ameaça detectada.
- **Exportação em PDF**: Baixe o relatório completo em formato PDF para documentação, auditoria e compartilhamento.
- **Interface Intuitiva**: Design moderno, limpo e responsivo.

---

## 🛠️ Tecnologias

### **Frontend**

- **Next.js**: Framework React para construção da interface com foco em performance.
- **React**: Biblioteca JavaScript para construção de UIs reativas.
- **Tailwind CSS**: Framework utilitário para estilização rápida e responsiva.
- **TypeScript**: Tipagem estática para robustez e manutenibilidade.

### **Geração de PDF (Client-side)**

- **jspdf**: Criação e manipulação de documentos PDF no navegador.
- **html2canvas**: Captura de elementos HTML como imagens para inclusão no PDF.

### **Integração com IA**

- **Mocks para APIs de IA**: Simulação de interações com modelos de IA para fins de desenvolvimento (ex.: `lib/gpt.ts`, `lib/stride.ts`).
- **Para uso real**: Integração prevista com:
  - Google Cloud Vision AI
  - Azure Computer Vision
  - OpenAI GPT / Google Gemini

---

## ⚙️ Instalação e Configuração

### **Pré-requisitos**

- Node.js (versão 18.x ou superior)
- npm ou Yarn

### **Passos**

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/arcsecure-ai.git
cd arcsecure-ai
```
