export { socialPreviewAlt, socialPreviewSize } from "@/lib/socialMetadata";

export default function SocialPreviewCard() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "58px 72px 48px",
        backgroundColor: "#F6F3EC",
        color: "#2E2C28",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 54,
            height: 54,
            borderRadius: 16,
            backgroundColor: "#211F1A",
            color: "#F3EFE6",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          J
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 15, letterSpacing: "0.18em", color: "#625D55" }}>
            LEARN ABOUT
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.08em" }}>
            JAINISM
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 720, gap: 22 }}>
          <span style={{ fontSize: 17, letterSpacing: "0.12em", color: "#8D673C" }}>
            AN ENGLISH LEARNING LIBRARY
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, lineHeight: 1.06 }}>
            <span>A careful beginning</span>
            <span>to a living tradition.</span>
          </div>
          <span style={{ fontSize: 25, color: "#625D55" }}>
            Ideas · Communities · Texts · Practices
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
            marginLeft: 12,
            border: "1px solid #D5CCBD",
            borderRadius: 999,
            backgroundColor: "#E9E3D8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 222,
              height: 222,
              border: "2px solid #A78357",
              borderRadius: 999,
              backgroundColor: "#F6F3EC",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 134,
                height: 134,
                border: "1px solid #D5CCBD",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  backgroundColor: "#596550",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #D5CCBD",
          paddingTop: 18,
          color: "#625D55",
          fontSize: 16,
        }}
      >
        <span>Source-aware study · Room for difference</span>
        <span>learnaboutjainism.com</span>
      </div>
    </div>
  );
}
