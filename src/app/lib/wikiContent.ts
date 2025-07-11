// src/app/lib/wikiContent.ts

export interface WikiTopic {
  slug: string;
  title: string;
  description: string;
  details: string[];
  externalLinks: { name: string; url: string }[];
}

export const wikiTopics: WikiTopic[] = [
  {
    slug: "spoofing",
    title: "Spoofing: Falsificação de Identidade",
    description:
      "Ameaças de Spoofing envolvem a falsificação de identidade para enganar usuários ou sistemas.",
    details: [
      "**O que é:** Um atacante se passa por uma entidade legítima (usuário, dispositivo, programa) para obter acesso ou informações.",
      "**Exemplos:** Phishing, falsificação de IP/DNS, roubo de sessão.",
      "**Impacto:** Acesso não autorizado, fraude, comprometimento da integridade dos dados.",
    ],
    externalLinks: [
      {
        name: "OWASP Top 10 - A01:2021-Broken Access Control (Relacionado)",
        url: "https://owasp.org/www-project-top-ten/2021/A01_2021-Broken_Access_Control.html",
      },
      {
        name: "MITRE ATT&CK - Credential Access",
        url: "https://attack.mitre.org/tactics/TA0006/",
      },
    ],
  },
  {
    slug: "tampering",
    title: "Tampering: Violação de Dados ou Integridade",
    description:
      "Ameaças de Tampering referem-se à modificação não autorizada de dados ou sistemas.",
    details: [
      "**O que é:** Ataques que visam alterar dados, código ou configurações sem permissão.",
      "**Exemplos:** Modificação de parâmetros de URL, adulteração de arquivos de log, injeção de código.",
      "**Impacto:** Dados corrompidos, funcionalidade comprometida, falha de segurança.",
    ],
    externalLinks: [
      {
        name: "OWASP Top 10 - A03:2021-Injection (Relacionado)",
        url: "https://owasp.org/www-project-top-ten/2021/A03_2021-Injection.html",
      },
      {
        name: "Web Hacking 101 - Tampering",
        url: "https://www.hackerone.com/resources/web-hacking-101-tampering",
      },
    ],
  },
  {
    slug: "repudiation",
    title: "Repudiation: Negação de Autoria",
    description:
      "Ameaças de Repudiation permitem que uma entidade negue ter realizado uma ação.",
    details: [
      "**O que é:** Falta de capacidade de provar que uma ação (ex: transação, acesso) foi realmente executada por uma parte específica.",
      "**Exemplos:** Falta de logs de auditoria, assinaturas digitais ausentes, registro de eventos insuficiente.",
      "**Impacto:** Dificuldade em investigar incidentes, disputas legais, não conformidade.",
    ],
    externalLinks: [
      {
        name: "NIST SP 800-92 - Guia para Auditoria de Sistemas",
        url: "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf",
      },
    ],
  },
  {
    slug: "information-disclosure",
    title: "Information Disclosure: Divulgação de Informações",
    description:
      "Ameaças de Information Disclosure (ou Vazamento de Informações) expõem dados confidenciais.",
    details: [
      "**O que é:** Divulgação não intencional ou maliciosa de informações sensíveis (pessoais, financeiras, credenciais, lógica de negócios).",
      "**Exemplos:** Mensagens de erro detalhadas, diretórios abertos, configuração de nuvem exposta, vazamento de chaves de API.",
      "**Impacto:** Roubo de dados, engenharia social, comprometimento de outros sistemas.",
    ],
    externalLinks: [
      {
        name: "OWASP Top 10 - A06:2021-Vulnerable and Outdated Components (Relacionado)",
        url: "https://owasp.org/www-project-top-ten/2021/A06_2021-Vulnerable_and_Outdated_Components.html",
      },
      {
        name: "OWASP Cheat Sheet Series - Error Handling",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html",
      },
    ],
  },
  {
    slug: "denial-of-service",
    title: "Denial of Service (DoS): Negação de Serviço",
    description:
      "Ameaças de Negação de Serviço impedem que usuários legítimos acessem um recurso.",
    details: [
      "**O que é:** Ataques que visam tornar um serviço ou recurso indisponível para seus usuários pretendidos.",
      "**Exemplos:** Ataques DDoS, consumo excessivo de recursos (CPU, memória, banda), falhas de software que levam a travamentos.",
      "**Impacto:** Interrupção de negócios, perda de receita, danos à reputação.",
    ],
    externalLinks: [
      {
        name: "Cloudflare - O que é um ataque DDoS?",
        url: "https://www.cloudflare.com/pt-br/learning/ddos/what-is-a-ddos-attack/",
      },
    ],
  },
  {
    slug: "elevation-of-privilege",
    title: "Elevation of Privilege: Elevação de Privilégios",
    description:
      "Ameaças de Elevation of Privilege permitem que um atacante obtenha mais privilégios do que deveria ter.",
    details: [
      "**O que é:** Um atacante com baixo nível de acesso consegue aumentar seus privilégios para obter controle sobre o sistema ou dados que não seriam normalmente acessíveis.",
      "**Exemplos:** Exploração de vulnerabilidades de software (CVEs), configurações incorretas de permissão, escalonamento vertical/horizontal de privilégios.",
      "**Impacto:** Controle total sobre o sistema, acesso a dados críticos, instalação de malware.",
    ],
    externalLinks: [
      {
        name: "OWASP Top 10 - A01:2021-Broken Access Control",
        url: "https://owasp.org/www-project-top-ten/2021/A01_2021-Broken_Access_Control.html",
      },
      {
        name: "MITRE ATT&CK - Privilege Escalation",
        url: "https://attack.mitre.org/tactics/TA0004/",
      },
    ],
  },
  // Você pode adicionar mais tópicos aqui, por exemplo:
  // {
  //   slug: "sql-injection",
  //   title: "SQL Injection: Ataques de Injeção SQL",
  //   description: "Exploração de vulnerabilidades em aplicações que constroem consultas SQL dinamicamente.",
  //   details: [
  //     "**O que é:** Inserção de código SQL malicioso em campos de entrada de uma aplicação para manipular o banco de dados.",
  //     "**Exemplos:** Acesso, modificação ou exclusão de dados não autorizados.",
  //     "**Impacto:** Vazamento de dados, corrupção de dados, negação de serviço.",
  //   ],
  //   externalLinks: [
  //     { name: "OWASP - SQL Injection", url: "https://owasp.org/www-community/attacks/SQL_Injection" }
  //   ]
  // }
];
