import { TanstackProvider } from "@/components/providers/tanstack-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Importa la fuente desde Google Fonts

import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"], // Subconjuntos que deseas incluir
  variable: "--font-poppins", // Define una variable CSS para la fuente
  weight: ["400", "700"], // Pesos necesarios
});

export const metadata: Metadata = {
  title: "TVB - The Pro PO",
  description: "The PRO PO By Top Value Brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={` ${poppins.variable}`}>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              // enableSystem
              // disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </TanstackProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
