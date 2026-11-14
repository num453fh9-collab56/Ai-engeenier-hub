import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { getTracks } from "@/lib/tracks";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Engineering Hub",
    template: "%s | AI Engineering Hub",
  },
  description:
    "Master AI Engineering from scratch — learn RAG pipelines, ReAct agents, fine-tuning, and MLOps with production-grade tutorials and interactive tools.",
  keywords: [
    "AI Engineering",
    "RAG",
    "Retrieval-Augmented Generation",
    "AI Agents",
    "ReAct Pattern",
    "Fine-Tuning",
    "LLM",
    "Machine Learning",
    "MLOps",
    "Vector Databases",
    "Pinecone",
    "Qdrant",
    "LangChain",
    "Groq",
    "OpenAI",
    "Structured Outputs",
    "Hybrid Search",
    "Cross-Encoder",
    "AI Tutorial",
  ],
  authors: [{ name: "AI Engineering Hub" }],
  creator: "AI Engineering Hub",
  publisher: "AI Engineering Hub",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Engineering Hub",
    title: "AI Engineering Hub",
    description:
      "Master AI Engineering from scratch — learn RAG pipelines, ReAct agents, fine-tuning, and MLOps with production-grade tutorials.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering Hub",
    description:
      "Master AI Engineering from scratch — learn RAG pipelines, ReAct agents, fine-tuning, and MLOps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header tracks={getTracks()} />
          {children}
          <Footer />
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
