import React from "react";
import ReactDOM from "react-dom/client";

// Import Bootstrap and Toastify BEFORE custom style.css so style.css takes precedence!
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App";

window.bootstrap = bootstrap;

ReactDOM
  .createRoot(document.getElementById("root"))
  .render(<App />);