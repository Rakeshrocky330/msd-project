import React from "react"
import ReactDOM from "react-dom/client"

// Safety: some embedded environments sandbox the document and accessing document.cookie throws.
// Add a safe getter to avoid uncaught SecurityError from third-party scripts (Builder SDK, etc.).
try {
  const docProto = Document.prototype
  const descriptor = Object.getOwnPropertyDescriptor(docProto, "cookie")
  if (!descriptor || descriptor.configurable) {
    Object.defineProperty(docProto, "cookie", {
      configurable: true,
      enumerable: true,
      get() {
        try {
          return descriptor && descriptor.get ? descriptor.get.call(document) : ""
        } catch (e) {
          return ""
        }
      },
      set(val) {
        try {
          if (descriptor && descriptor.set) descriptor.set.call(document, val)
        } catch (e) {
          // ignore
        }
      },
    })
  }
} catch (e) {
  // ignore if we can't redefine cookie
}

// Global error handler to capture and avoid crashing on third-party SDK errors
window.addEventListener("error", (ev) => {
  // Optionally send to monitoring service here
  console.warn("Captured error:", ev.message)
})

import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
