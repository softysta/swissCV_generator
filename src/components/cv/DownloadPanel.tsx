"use client";

type Props = {
  onExport: () => Promise<void>;
  isExporting: boolean;
};

export default function DownloadPanel({ onExport, isExporting }: Props) {
  return (
    <div
      style={{
        background:    "#ffffff",
        borderRadius:  16,
        padding:       "26px 40px",
        marginTop:     20,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
        boxShadow:     "0 1px 6px rgba(0,0,0,0.07)",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width:          54,
            height:         54,
            borderRadius:   14,
            background:     "#f0fdf4",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          <CheckCircleIcon />
        </div>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 2 }}>
            Your CV is ready!
          </p>
          <p style={{ fontSize: 13, color: "#888" }}>
            Validated for professional standards.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={onExport}
        disabled={isExporting}
        style={{
          background:    isExporting ? "#9ca3af" : "#15803d",
          color:         "#ffffff",
          border:        "none",
          borderRadius:  10,
          padding:       "14px 28px",
          fontSize:      14,
          fontWeight:    700,
          cursor:        isExporting ? "not-allowed" : "pointer",
          display:       "flex",
          alignItems:    "center",
          gap:           8,
          fontFamily:    "inherit",
          flexShrink:    0,
          transition:    "background 0.15s",
        }}
      >
        {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
        {isExporting ? "Exporting…" : "Download PDF"}
      </button>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#16a34a" strokeWidth="2" />
      <path
        d="M8 14.5L12 18L20 10"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 11L4 7H6.5V2H9.5V7H12L8 11Z" />
      <rect x="2" y="12" width="12" height="2" rx="1" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M8 2A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}