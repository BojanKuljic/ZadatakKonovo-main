const API_BASE = "http://localhost:8000"; // ili tvoj backend URL

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const getProducts = async (token) => {
  const response = await fetch(`${API_BASE}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Unauthorized");
  return response.json();
};