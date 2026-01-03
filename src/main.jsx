import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import CountUp from "./components/count_up/CountUp";
import Preloader from "./components/preloader/PreLoader";

const Root = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      {!loading && <App />}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
