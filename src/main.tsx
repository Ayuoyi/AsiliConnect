import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

console.log("Application starting...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    console.log("Rendering application...");
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Failed to render application:", error);
  }
}
