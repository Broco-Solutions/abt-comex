import { Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScenarioProvider } from "@/features/demo/state/scenario-provider"
import { cn } from "@workspace/ui/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ABT Comex",
  description: "Sistema de gestión empresarial de ABT Comex.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-AR"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("font-sans antialiased", inter.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>
          <ScenarioProvider>{children}</ScenarioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
