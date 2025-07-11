
import Link from "next/link";
import { wikiTopics } from "../lib/wikiContent";

export default function WikiIndexPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gray-950 font-sans text-gray-100">
      <div className="w-full max-w-4xl bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700 mt-12 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-teal-400 border-b pb-3 border-gray-700 text-center">
          Wiki de Segurança 📚
        </h1>

        <p className="text-lg text-gray-300 mb-8 text-center">
          Explore os tópicos de segurança e as ameaças STRIDE para aprofundar
          seu conhecimento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wikiTopics.map((topic) => (
            <div
              key={topic.slug}
              className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600 hover:shadow-xl transition-shadow duration-200 ease-in-out"
            >
              <h2 className="text-xl font-bold text-teal-300 mb-2">
                {topic.title}
              </h2>
              <p className="text-gray-300 text-sm mb-3">{topic.description}</p>
              <Link
                href={`/wiki/${topic.slug}`}
                className="inline-block bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200"
              >
                Saiba Mais &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
