import { ImageResponse } from "next/og";

export const alt = "NavUrja — Give Waste a New Energy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0e241c",
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(46,158,91,0.35), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#2e9e5b",
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 600, color: "#f2f8f4" }}>
            Navurja
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.08,
            color: "#f2f8f4",
            maxWidth: 880,
          }}
        >
          <span>Give waste</span>
          <span>
            a new <span style={{ color: "#2e9e5b" }}>energy.</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#a9c9b8",
            maxWidth: 720,
          }}
        >
          Turning used cooking oil into renewable energy — a circular,
          smart, and sustainable approach to a cleaner tomorrow.
        </div>
      </div>
    ),
    { ...size }
  );
}
