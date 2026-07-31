import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import CountUp from "./components/ui/CountUp";
import Preloader from "./components/ui/PreLoader";

import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
