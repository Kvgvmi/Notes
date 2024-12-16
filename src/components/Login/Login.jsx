import React, { useState } from "react";
import axios from "axios";
import './Login.css';


const Login =  ({ setToken,setIsConnected, setUserInfo })  => {
  const [cin, setcin] = useState("");
  const [password, setpassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://notes.devlop.tech/api/login", {
        cin,
        password,
      });

      if (res.status === 200) {
        setUserLoggedIn(true);
        setIsConnected(true);
        setToken(res.data.token);
        setUserInfo({
          userfirstname: res.data.user.first_name,
          userlastname: res.data.user.last_name,
        });

        // Save CIN and password to localStorage
        localStorage.setItem("cin", cin);
        localStorage.setItem("password", password);
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      console.log("Login failed");
      setUserLoggedIn(false);
    }
  };

  return (
    <div className="login-container">
        <form onSubmit={handleLoginClick}
        className="login-form">
          <h1>
            Welcome <span role="img" aria-label="wave">🪐</span>
          </h1>
          <p>Sign in to your account</p>
          <input
            type="text"
            value={cin}
            onChange={(e) => setcin(e.target.value)}
            placeholder="Your CIN"
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Your Password"
            className="login-input"
          />
          <button  className="login-button"> Login </button>
        </form>
      
    </div>
  );
};

export default Login;
