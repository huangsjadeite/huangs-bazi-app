import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ZodiacLuckPage from "./components/zodiac-luck/ZodiacLuckPage.jsx";
import { getAdminTool, isAdminUrl } from "./config/adminAccess.js";

const page = isAdminUrl() && getAdminTool() === "zodiac" ? <ZodiacLuckPage /> : <App />;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {page}
  </StrictMode>
);