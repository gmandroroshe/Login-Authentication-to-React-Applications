import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
    history.push("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
