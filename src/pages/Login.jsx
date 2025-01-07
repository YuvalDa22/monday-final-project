import { useNavigate } from "react-router";
import { login } from "../store/user/user.actions";
import { useState } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { AppHeader } from "../cmps/AppHeader";
import { Link } from "react-router-dom";

export function Login() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!user.email || !user.password) {
      showErrorMsg("Please fill in all fields");
      return;
    }

    try {
      await login(user);
      navigate("/index");
      showSuccessMsg("Logged in successfully");
    } catch (err) {
      showErrorMsg(err.message || "Invalid credentials");
    }
  }

  return (
    <>
      <AppHeader />
      <div className="container">
        <h1>Log into you account !</h1>
        <form className="login-form " onSubmit={handleSubmit}>
          <div className="form-section">
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Email-adress"
            />
          </div>
          <div className="form-section">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div>
          <p>
            {" "}
            don't have an account ? <Link to={"/signup"}>sign up</Link>{" "}
          </p>
        </div>
      </div>
    </>
  );
}
