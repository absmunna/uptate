import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Theme is now controlled by <ThemeProvider> (reads localStorage). We seed
// "dark" pre-mount so first paint isn't a flash of unstyled light.
if (typeof document !== "undefined") {
  try {
    const stored = window.localStorage.getItem("pm.theme.v1");
    const allowed = ["dark", "light", "midnight", "forest", "sunset", "deepDark", "colourful", "nakshiLight", "greenField"];
    const cls = stored && allowed.includes(stored) ? stored : "midnight";
    document.documentElement.classList.add(cls);
  } catch {
    document.documentElement.classList.add("midnight");
  }
}

createRoot(document.getElementById("root")!).render(<App />);
