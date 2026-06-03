import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./styles/globals.css";

import Landing from "./pages/Landing";
import Module1 from "./pages/Module1";
import Module2 from "./pages/Module2";
import Module3 from "./pages/Module3";
import Module4 from "./pages/Module4";
import NotFound from "./pages/NotFound";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found in index.html");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/module/1" element={<Module1 />} />
        <Route path="/module/2" element={<Module2 />} />
        <Route path="/module/3" element={<Module3 />} />
        <Route path="/module/4" element={<Module4 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
