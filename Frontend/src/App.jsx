import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";

function App() {
  const token = localStorage.getItem("token");

  // Pre pristupa listi proizvoda, aplikacija mora proveriti postojanje JWT tokena
  //  i preusmeriti korisnika na login stranicu ako token nije prisutan. (linija 19)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      
        <Route
          path="/products"
          element={token ? <Products /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
