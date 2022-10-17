import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./routes/Home";
import DNS from "./routes/Modification/DNS";
import Host from "./routes/Analytics/Host";
import MitMAttackDevice from "./routes/Analytics/MitMAttackDevice";
import NetworkGateway from "./routes/Analytics/NetworkGateway";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <Home />
      </App>
    ),
  },
  {
    path: "/Modification/DNS",
    element: (
      <App>
        <DNS />
      </App>
    ),
  },
  {
    path: "/Analytics/Host",
    element: (
      <App>
        <Host />
      </App>
    ),
  },
  {
    path: "/Analytics/MitMAttackDevice",
    element: (
      <App>
        <MitMAttackDevice />
      </App>
    ),
  },
  {
    path: "/Analytics/NetworkGateway",
    element: (
      <App>
        <NetworkGateway />
      </App>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
