import { useState } from "react";
// import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { Navbar } from "./components/Navbar";
import { getToken, clearToken } from "./api/authToken";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => getToken() !== null);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <>
      <Navbar onLogout={handleLogout} />
      <Container maxWidth="md">
        <Box sx={{ py: 2, textAlign: "center" }}>
          <HomePage />
        </Box>
      </Container>
    </>
  ) : (
    <LoginPage onSuccess={() => setIsLoggedIn(true)} />
  );
}

export default App;
