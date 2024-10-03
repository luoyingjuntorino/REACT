import React, { useState } from "react";
import { login } from "../utils/auth";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    username: "",
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
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        placeholder="Username"
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
