import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "LINEA XI — Simulatore di carriera";
  const description =
    "Vivi una carriera calcistica semestre per semestre: scegli il ruolo, confronta le offerte, tratta lo stipendio e affronta le conseguenze delle tue decisioni.";
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    icons: { icon: socialImage, shortcut: socialImage },
    openGraph: {
      type: "website",
      title,
      description,
      url: origin,
      images: [{ url: socialImage, width: 1672, height: 941, alt: "LINEA XI — Ogni sei mesi, una scelta." }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
