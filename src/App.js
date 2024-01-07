import DataProvider from "./contexts/authContext";

import { BrowserRouter } from "react-router-dom";

import { Box } from "@mui/material";

// components
// import Login from "./components/auth/Login";
// import Home from "./components/pages/Home";
// import GetUsers from "./components/user/GetUsers";
// import GetPendingList from "./components/pendingList/GetPendingList";
import AppRoutes from "./App.routes";
import Navbar from "./components/navbar/Navbar";

// const PrivateRoute = () => {

//   return account.username ? (
//     <>
//       <Outlet />
//     </>
//   ) : (
//     <Navigate replace to="/login"></Navigate>
//   );
// };

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Box sx={{}}>
          <Navbar />
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
