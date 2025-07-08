import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setSuccessMsg("Uspešno ste ulogovani!");

        setTimeout(() => {
          navigate("/products");
        }, 1500); // sačekaj 1.5 sekundi da korisnik vidi poruku
      } else {
        setErrorMsg("Prijava nije uspela: Pogrešni podaci ili greška servera.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Prijava nije uspela: Greška u mreži.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Prijava</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Korisničko ime:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Lozinka:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          style={{ marginTop: "1.5rem", padding: "0.5rem 1rem", width: "100%" }}
        >
          Prijavi se
        </button>

        {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
