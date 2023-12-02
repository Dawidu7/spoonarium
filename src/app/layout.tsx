import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "~/components/ui/toaster"

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })

export const metadata: Metadata = {
  title: "Spoonarium",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} font-open-sans`}>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
