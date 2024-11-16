import axios from "axios";

const login = async (credentials) => {
  const response = await axios.post("/api/auth/login", credentials);
  localStorage.setItem("token", response.data.token);
};

const authService = { login };
export default authService;
