// src/app/lib/stride.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateStrideReport(components: any[]): Promise<any> {
  const prompt = `
Você é um especialista em segurança de sistemas e arquitetura. Avalie os componentes abaixo com base na metodologia STRIDE.
Para cada componente, identifique as ameaças de segurança STRIDE, proponha contramedidas e, além disso,
sugira padrões de arquitetura seguros ou melhores práticas para mitigar essas ameaças nesse tipo de componente.

Gere um relatório de modelagem de ameaças no seguinte formato JSON:

[
  {
    "nome": "NOME DO COMPONENTE",
    "tipo": "TIPO",
    "ameacas": [
      {
        "categoria": "STRIDE (ex: Spoofing)",
        "descricao": "Breve explicação da ameaça",
        "contramedidas": "Medidas de prevenção ou mitigação",
        "criticidade": "NÍVEL DE CRITICIDADE (ex: Baixa, Média, Alta, Crítica)"
      }
    ],
    "sugestoesDeArquiteturaSegura": [
      "Sugestão 1 para este componente",
      "Sugestão 2 para este componente"
    ]
  }
]

Componentes para análise:
${JSON.stringify(components, null, 2)}

Responda apenas com o JSON. Não inclua explicações ou texto adicional.
  `;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3000,
      response_format: { type: "json_object" },
    }),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const cleaned = content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const parsedData = JSON.parse(cleaned);

    // --- LÓGICA DE PARSEAMENTO ATUALIZADA ---
    if (parsedData && Array.isArray(parsedData.result)) {
      // Se a IA encapsular em uma chave "result"
      return parsedData.result;
    } else if (parsedData && Array.isArray(parsedData.componentes)) {
      // Se a IA encapsular em uma chave "componentes" (formato anterior)
      return parsedData.componentes;
    } else if (Array.isArray(parsedData)) {
      // Se a IA retornar o array diretamente (formato ideal)
      return parsedData;
    } else {
      // Caso o formato seja totalmente inesperado
      console.error("Formato de resposta inesperado da IA:", parsedData);
      return {
        raw: content,
        error:
          "Formato de relatório STRIDE inesperado da IA. Nenhuma chave de array reconhecida (e.g., 'result', 'componentes').",
      };
    }
  } catch (e) {
    console.error(
      "Erro ao fazer parse do JSON da OpenAI:",
      e,
      "Conteúdo recebido:",
      content
    );
    return { raw: content, error: "Falha ao parsear a resposta JSON da IA." };
  }
}
