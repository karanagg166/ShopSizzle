import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shop Sizzle | Premium Fashion",
  description: "Discover premium fashion curated for the modern you. Elevate your style with our exclusive collection.",
  keywords: ["fashion", "clothing", "e-commerce", "premium", "style"],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-background text-foreground min-h-screen relative overflow-x-hidden antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {/* Main Content */}
            <div className="relative min-h-screen">
              <Navbar />
              <main className="pt-20">
                {children}
              </main>
            </div>

            {/* Toast Notifications */}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              theme="dark"
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
