import { useState } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { getToken, clearToken } from "./api/authToken";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => getToken() !== null);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 2, textAlign: "center" }}>
        {isLoggedIn ? (
          <HomePage
            onLogout={() => {
              clearToken();
              setIsLoggedIn(false);
            }}
          />
        ) : (
          <LoginPage onSuccess={() => setIsLoggedIn(true)} />
        )}
      </Box>
    </Container>
  );
}

export default App;
