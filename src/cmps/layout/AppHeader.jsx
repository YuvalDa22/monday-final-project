import { useNavigate } from "react-router";

import { Link } from "react-router-dom";

export function AppHeader() {
  const navigate = useNavigate();
  return (
    <div className="header-flex">
      <div>
        <img
          onClick={() => navigate("/")}
          src="https://agenda.agami-network.com/static/media/agenda-logo-color.cb0ce09dcc5b97c18eb5755c559acc2a.svg"
          alt="logo"
        />
        <h2>Tomorrow</h2>
      </div>
      <div>
        <button onClick={() => navigate("/login")}>Log in</button>
        <button>Start Demo</button>
      </div>
    </div>
  );
}
