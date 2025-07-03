import { FormData, File as FormDataFile } from "formdata-node";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function extractComponentsFromImage(file: File): Promise<any> {
  const buffer = await file.arrayBuffer();
  const formData = new FormData();

  formData.set(
    "file",
    new FormDataFile(Buffer.from(buffer), file.name, { type: file.type })
  );

  const base64Image = Buffer.from(buffer).toString("base64");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Você é um especialista em segurança de software. A imagem a seguir contém um diagrama de arquitetura de sistema. Por favor, identifique os componentes presentes nela e retorne como um JSON estruturado com os seguintes campos:
- nome
- tipo (ex: usuário, servidor, API, banco de dados, etc)
- breve descrição funcional`,
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
      max_tokens: 1500,
    }),
  });

  const data = await res.json();
  const content = data.choices[0].message.content;

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return { raw: content };
  }
}
