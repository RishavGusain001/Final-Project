import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/register", {
        username: email,
        password: password,
      });

      alert("Registered successfully!");
      navigate("/");

    } catch (error) {
      alert("Error registering");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;