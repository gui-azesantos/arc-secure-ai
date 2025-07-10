// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function extractComponentsFromImage(file: File): Promise<any> {
  const buffer = await file.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");

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
          content: [
            {
              type: "text",
              text: `A imagem a seguir contém um diagrama de arquitetura de software. Extraia os componentes presentes e responda **exclusivamente** com um array JSON no seguinte formato:

  [
    {
    "nome": "string",
    "tipo": "usuário | servidor | banco de dados | API | processo | sistema | outro",
    "descricao": "breve descrição da função ou papel do componente no sistema"
    },
    ...
  ]

  Não escreva nenhuma explicação. Responda apenas com o JSON.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    }),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return { raw: content };
  }
}
