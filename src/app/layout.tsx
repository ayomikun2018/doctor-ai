import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { athleticsFont } from "@/lib/font";
import Providers from "@/providers/permission-provider";
export const metadata: Metadata = {
  title: "Delegate AI",
  description: "Delegate AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${athleticsFont.className} font-sans`} lang="en">
      <Providers>
        <body>
          {children}
          <Toaster richColors={true} position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
