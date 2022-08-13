import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App_personal from "./components/AppPersonal";
import App_vehicle from "./components/AppVehicle";
import EndPage from "./components/EndPage";

const react_endpoint11 = document.getElementById("react_endpoint-1-1");
const root11 = createRoot(react_endpoint11);

root11.render(
  <StrictMode>
    <App_personal />
  </StrictMode>
);

const react_endpoint21 = document.getElementById("react_endpoint-2-1");
const root21 = createRoot(react_endpoint21);

root21.render(
  <StrictMode>
    <App_vehicle />
  </StrictMode>
);

const react_endpoint31 = document.getElementById("react_endpoint-3-1");
const root31 = createRoot(react_endpoint31);

root31.render(
  <StrictMode>
    <EndPage />
  </StrictMode>
);
