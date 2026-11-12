import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTracks } from "@/lib/tracks";
import { Certificate } from "@/components/certificate";

export const metadata: Metadata = { title: "Certificate", robots: { index: false } };

export function generateStaticParams() {
  return getTracks().map((t) => ({ track: t.category }));
}

export default async function CertificatePage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const info = getTracks().find((t) => t.category === track);
  if (!info) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Certificate track={info} />
    </div>
  );
}
