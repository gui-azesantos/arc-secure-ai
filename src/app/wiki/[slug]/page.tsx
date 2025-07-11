// src/app/wiki/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { WikiTopic, wikiTopics } from "../../lib/wikiContent";

interface WikiPageProps {
  params: {
    slug: string;
  };
}

export default function WikiPage({ params }: WikiPageProps) {
  const { slug } = params;

  // Encontra o tópico correspondente ao slug
  const topic: WikiTopic | undefined = wikiTopics.find((t) => t.slug === slug);

  // Se o tópico não for encontrado, exibe a página 404 do Next.js
  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gray-950 font-sans text-gray-100">
      <div className="w-full max-w-4xl bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700 mt-12 mb-8">
        <Link
          href="/upload"
          className="text-teal-400 hover:underline mb-4 block"
        >
          &larr; Voltar ao Relatório
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-teal-400 border-b pb-3 border-gray-700">
          {topic.title}
        </h1>
        <p className="text-lg text-gray-300 mb-6">{topic.description}</p>

        <div className="space-y-4 mb-8">
          {topic.details.map((detail, index) => (
            <p key={index} className="text-gray-200 leading-relaxed">
              {/* Permite formatação simples como negrito (**) */}
              <span
                dangerouslySetInnerHTML={{
                  __html: detail.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </p>
          ))}
        </div>

        {topic.externalLinks && topic.externalLinks.length > 0 && (
          <div className="border-t pt-6 border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-teal-300">
              Recursos Adicionais
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {topic.externalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

// Opcional: Gerar caminhos estáticos para slugs conhecidos (melhora o SEO e performance)
export async function generateStaticParams() {
  return wikiTopics.map((topic) => ({
    slug: topic.slug,
  }));
}
