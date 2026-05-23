import { ShopProvider } from "@/contexts/ShopContext";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ShopProvider>
    <App />
  </ShopProvider>
);
