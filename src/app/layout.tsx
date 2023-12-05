import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import Navbar from "~/components/layout/navbar"
import Sidebar from "~/components/layout/sidebar"
import { Toaster } from "~/components/ui/toaster"
import { getSession } from "~/server/auth"

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })

export const metadata: Metadata = {
  title: "Spoonarium",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getSession()

  return (
    <html lang="en">
      <body className={`${openSans.className} font-open-sans`}>
        <Providers>
          <Navbar user={user} />
          <div className="flex">
            <Sidebar user={user} />
            <main className="grid w-full place-items-center">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
