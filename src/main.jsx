import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalStyles from "./style/GlobalStyles.jsx";

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <>
    <GlobalStyles />
    <App />
  </>

  //</StrictMode>,
);
