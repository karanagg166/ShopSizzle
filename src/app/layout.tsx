import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google"; // Luxury Fonts
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import SmoothScrolling from "@/components/SmoothScrolling";
import { Toaster } from "sonner";
// ... imports

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
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
      <body className={`${playfair.variable} ${outfit.variable} font-sans bg-background text-foreground min-h-screen relative overflow-x-hidden antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <SmoothScrolling>
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
            </SmoothScrolling>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
