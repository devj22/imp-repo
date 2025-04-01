import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Font Awesome to the document
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// Add Google Fonts to the document
const googleFonts = document.createElement('link');
googleFonts.rel = 'stylesheet';
googleFonts.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap';
document.head.appendChild(googleFonts);

createRoot(document.getElementById("root")!).render(<App />);
