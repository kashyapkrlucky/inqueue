import { createRoot } from "react-dom/client";
import "./styles/index.css";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

const renderStartupError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  console.error("Failed to start InQueue:", error);
  root.render(
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "system-ui, sans-serif",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          maxWidth: "32rem",
          border: "1px solid #fecaca",
          background: "#fef2f2",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          color: "#7f1d1d",
        }}
      >
        <h1 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
          InQueue couldn&apos;t start
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
    </div>,
  );
};

// App.tsx (and its import graph — axios.ts, useAuthStore.ts, etc.) validates
// required env vars as a side effect of being imported. That's loaded
// dynamically here, inside a try/catch, specifically so a misconfigured
// deployment shows this clear error screen instead of a blank white page or
// an uncaught console exception.
import("./app/App.tsx")
  .then(({ default: App }) => root.render(<App />))
  .catch(renderStartupError);
