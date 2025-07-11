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
      model: "gpt-3.5-turbo",
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

  if (!content) {
    console.error(
      "API da OpenAI retornou conteúdo nulo ou vazio. Resposta completa da API:",
      data
    );
    return {
      raw: content,
      error:
        "A API da OpenAI não retornou um conteúdo válido. Verifique sua chave da API ou tente novamente.",
    };
  }

  try {
    const cleaned = content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const parsedData = JSON.parse(cleaned);

    if (Array.isArray(parsedData)) {
      return parsedData;
    } else if (parsedData && Array.isArray(parsedData.result)) {
      return parsedData.result;
    } else if (parsedData && Array.isArray(parsedData.componentes)) {
      return parsedData.componentes;
    } else if (
      parsedData &&
      typeof parsedData === "object" &&
      parsedData !== null
    ) {
      console.warn(
        "API da OpenAI retornou um único objeto em vez de um array. Envolvendo em array."
      );
      return [parsedData];
    } else {
      console.error("Formato de resposta inesperado da IA:", parsedData);
      return {
        raw: content,
        error:
          "Formato de relatório STRIDE inesperado da IA. Nenhuma chave de array reconhecida.",
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
