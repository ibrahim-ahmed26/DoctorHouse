"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--ink)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
          borderRadius: 12,
        },
        success: { iconTheme: { primary: "#5fe3d6", secondary: "#1f2121" } },
      }}
    />
  );
}
