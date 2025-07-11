
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArcSecure AI",
  description: "Análise de segurança de diagramas de arquitetura com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-gray-900 p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-200"
            >
              ArcSecure AI
            </Link>
            <div className="space-x-6">
              <Link
                href="/upload"
                className="text-gray-200 hover:text-teal-400 transition-colors duration-200 text-lg font-medium"
              >
                Análise
              </Link>
              <Link
                href="/wiki"
                className="text-gray-200 hover:text-teal-400 transition-colors duration-200 text-lg font-medium"
              >
                Wiki de Segurança
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
