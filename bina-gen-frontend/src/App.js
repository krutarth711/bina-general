import { useState, useEffect, useContext } from "react";

import DataProvider, { DataContext } from "./contexts/authContext";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

// components
import Login from "./components/auth/Login";
import Home from "./components/pages/Home";

const PrivateRoute = () => {
  const { account } = useContext(DataContext);
  return account.username ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate replace to="/login"></Navigate>
  );
};

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div style={{ marginTop: 64 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
