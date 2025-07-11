/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateStrideReport(components: any[]): Promise<any> {
  const prompt = `
Você é um especialista em segurança de sistemas. Avalie os componentes abaixo com base na metodologia STRIDE e gere um relatório de modelagem de ameaças no seguinte formato:

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
    ]
  }
]

Componentes:
${JSON.stringify(components, null, 2)}

Responda apenas com o JSON. Não inclua explicações.
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


    if (parsedData && Array.isArray(parsedData.componentes)) {
      return parsedData.componentes;
    } else if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      console.error("Formato de resposta inesperado da IA:", parsedData);
      return {
        raw: content,
        error: "Formato de relatório STRIDE inesperado da IA.",
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
