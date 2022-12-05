import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DNS from "./routes/Modification/DNS";
import Analytics from "./routes/Analytics";

const routePathNames = {
  "/": "Home",
  "/Modification": "Modification",
  "/Modification/DNS": "DNS",
  "/Analytics": "Analytics",
};
const unreachablePages = ["/", "/Modification"];

const routerPaths = [
  {
    path: "/",
    element: (
      <App routePathNames={routePathNames} unreachablePages={unreachablePages}>
        <Navigate to="/Modification/DNS" />
      </App>
    ),
  },
  {
    path: "/Modification/DNS",
    element: (
      <App routePathNames={routePathNames} unreachablePages={unreachablePages}>
        <DNS />
      </App>
    ),
  },
  {
    path: "/Analytics",
    element: (
      <App routePathNames={routePathNames} unreachablePages={unreachablePages}>
        <Analytics />
      </App>
    ),
  },
];
const router = createBrowserRouter(routerPaths);

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
