import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '/styles/Login.css';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warn("Unesite korisničko ime i lozinku!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      //Pre pristupa listi proizvoda, aplikacija mora proveriti postojanje JWT tokena
      //  i preusmeriti korisnika na login stranicu ako token nije prisutan.
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Uspešno ste ulogovani!");

        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        toast.error("Pogrešni podaci za prijavu!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Greška u mreži. Pokušajte ponovo.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" marginBottom="-250px" autoClose={2000} hideProgressBar />

      <div className="content">
        <img
          src="https://konovo.rs/wp-content/uploads/2025/07/Konovo-LOGO-letnja-akcija.png"
          alt="Logo"
          style={{ width: "200px", marginBottom: "20px" }}
        />
        <form className="form formLogin" onSubmit={handleLogin}>
          <div className="groupInput">
            <input
              type="text"
              placeholder="Korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="fa fa-fw fa-user"></i>
          </div>
          <div className="groupInput">
            <input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fa fa-fw fa-key"></i>
          </div>
          <button type="submit" className="btn btnLogin">Prijavi se</button>
        </form>

      </div>
    </div>

  );
};

export default Login;
