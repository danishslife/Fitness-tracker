import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 2, textAlign: "center" }}>
        <HomePage />
      </Box>
    </Container>
  );
}

export default App;
