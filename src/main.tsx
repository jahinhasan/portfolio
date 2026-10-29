import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./styles/global.css";
import { App } from "@/App";
import { loadPreferences } from "@/features/customization/preferences";
import { applyAccent, applyDocumentTheme } from "@/features/customization/applyTheme";

/**
 * Apply stored theme/accent BEFORE first paint so a returning visitor
 * never sees the default theme flash.
 */
const initial = loadPreferences();
applyDocumentTheme(initial.preferences.theme);
applyAccent(initial.preferences.accent);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <App initialPreferences={initial} />
  </StrictMode>,
);
