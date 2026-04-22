import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nou Bar Maó — Des de 1986",
  description: "Bar i cafeteria al cor del casc antic de Maó. Tapes, begudes, música en directe i la millor pomada de Menorca.",
  keywords: "Nou Bar, Maó, Menorca, bar, tapes, pomada, música en directe, casc antic",
};

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <>{children}</>;
}
