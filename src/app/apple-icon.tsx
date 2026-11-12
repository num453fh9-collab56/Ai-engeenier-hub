import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon (full-bleed: iOS applies its own rounded mask)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <LogoMark size={140} withBrackets={false} ink="#0f1e4a" deep="#12245c" />
      </div>
    ),
    size
  );
}
