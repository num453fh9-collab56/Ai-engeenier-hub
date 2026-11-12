import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon (full-bleed: iOS applies its own rounded mask)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <LogoMark size={180} withBrackets={false} />
      </div>
    ),
    size
  );
}
