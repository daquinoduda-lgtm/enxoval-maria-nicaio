import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1>Enxoval da primeira casinha da Maria & Nicaio 🏠🤍</h1>
      <p>Um pedacinho da nossa primeira casinha começa com você.</p>
      <button>🎁 VER NOSSA LISTA</button>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
