import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { googleFontsHref } from "@/theme/buildTheme";

export const metadata: Metadata = {
  title: "Portfolio Builder — Visual Portfolio SaaS",
  description:
    "Visually create, customize, preview, and export professional portfolio websites without coding.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={googleFontsHref} />
      </head>
      <body>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
