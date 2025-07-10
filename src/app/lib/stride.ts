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
        "contramedidas": "Medidas de prevenção ou mitigação"
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
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
    }),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const cleaned = content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return { raw: content };
  }
}
