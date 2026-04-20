"use client";

import { TTemplateId } from "@/types/cvContent.tye";


type Props = {
  id: TTemplateId;
  label: string;
  badge: string;
  tag: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
};

export default function TemplateCard({
  label,
  badge,
  tag,
  selected,
  onSelect,
  children,
}: Props) {
  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: 12,
        cursor:       "pointer",
        overflow:     "hidden",
        background:   "#f0f1f9",
        border:       selected ? "2.5px solid #1a2456" : "2px solid #e0e1ee",
        boxShadow:    selected ? "0 4px 16px rgba(26,36,86,0.12)" : "none",
        transition:   "all 0.15s ease",
        position:     "relative",
      }}
    >
      {/* Checkmark */}
      {selected && (
        <div
          style={{
            position:       "absolute",
            top:            12,
            right:          12,
            zIndex:         20,
            width:          30,
            height:         30,
            borderRadius:   "50%",
            background:     "#1a2456",
            color:          "#ffffff",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       14,
            fontWeight:     700,
          }}
        >
          ✓
        </div>
      )}

      {/* Scaled Preview — 224/794 = 0.282 */}
      <div style={{ display: "flex", justifyContent: "center", padding: "18px 20px 0" }}>
        <div
          style={{
            width:        224,
            height:       316,
            overflow:     "hidden",
            borderRadius: 4,
            boxShadow:    "0 6px 24px rgba(0,0,0,0.15)",
            flexShrink:   0,
          }}
        >
          <div
            style={{
              transform:       "scale(0.282)",
              transformOrigin: "top left",
              width:           794,
              height:          1123,
              pointerEvents:   "none",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          padding:        "16px 20px 18px",
        }}
      >
        <div>
          <p
            style={{
              fontSize:      10,
              fontWeight:    700,
              color:         "#16a34a",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom:  3,
            }}
          >
            {tag}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>
            {label}
          </p>
        </div>
        <span
          style={{
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            padding:       "5px 14px",
            border:        "1.5px solid #1a2456",
            borderRadius:  5,
            color:         "#1a2456",
          }}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}