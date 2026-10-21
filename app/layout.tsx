import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buzón de sugerencias",
  description: "Caso simple del taller: formulario, IA, base de datos y aprobación humana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
