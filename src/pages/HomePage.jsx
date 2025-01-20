import { AppHeader } from "../cmps/layout/AppHeader";
import { useNavigate } from "react-router-dom";
export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <AppHeader />
      <div className="hero-layout">
        <div className="hero">
          <h1>A platform for company tasks managment</h1>
        </div>
        <div>
          <button
            className="hero-btn"
            onClick={() => {
              navigate("/workspace/board/b101");
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
