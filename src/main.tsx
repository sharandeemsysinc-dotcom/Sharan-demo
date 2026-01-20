import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/stores/store";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
