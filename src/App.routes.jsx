import React, { useContext } from 'react';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import { DataContext } from "./contexts/authContext";

// components
import Login from "./components/auth/Login";
import Home from "./components/pages/Home";
import GetUsers from "./components/user/GetUsers";
import GetPendingList from "./components/pendingList/GetPendingList";

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

const AppRoutes = () => {
    return (
        <div style={{ marginTop: 64 }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route exact path="/" element={<PrivateRoute />}>
                    <Route exact path="/" element={<Home />} />
                </Route>
                <Route exact path="/users" element={<PrivateRoute />}>
                    <Route exact path="/users" element={<GetUsers />} />
                </Route>
                <Route exact path="/pending-list" element={<PrivateRoute />}>
                    <Route
                        exact
                        path="/pending-list"
                        element={<GetPendingList />}
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default AppRoutes;
