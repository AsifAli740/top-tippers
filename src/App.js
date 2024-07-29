import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/LoginPage/LoginPage.jsx";
import { OpenNotification } from "./components/Snackbar.jsx";
import DashboardComponent from "../src/components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
      </Routes>
      <OpenNotification />
    </div>
  );
}

export default App;
