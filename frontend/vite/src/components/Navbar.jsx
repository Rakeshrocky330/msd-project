import { useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">AI Career Tracker</div>
      <div className="nav-links">
        <a onClick={() => navigate("/dashboard")}>Dashboard</a>
        <a onClick={() => navigate("/logs")}>Logs</a>
        <a onClick={() => navigate("/goals")}>Goals</a>
        <a onClick={() => navigate("/skills")}>Skills</a>
        <a onClick={() => navigate("/analytics")}>Analytics</a>
        <a onClick={() => navigate("/profile")}>Profile</a>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  )
}
