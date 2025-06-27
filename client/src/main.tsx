import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@fontsource/inter"; // ✅ This imports the Inter font globally

createRoot(document.getElementById("root")!).render(<App />);