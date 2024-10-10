import React, { useState } from "react";
import { login } from "../utils/auth";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      setIsAuthenticated(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={credentials.login}
        onChange={(e) =>
          setCredentials({ ...credentials, login: e.target.value })
        }
        placeholder="Login"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
