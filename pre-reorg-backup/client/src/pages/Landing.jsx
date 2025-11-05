import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles/Landing.css"

export default function Landing() {
  const navigate = useNavigate()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setHasToken(Boolean(token))
  }, [])

  const handleStart = () => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard")
      return
    }
    navigate("/register")
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-wrap">
          <img className="brand-icon" src="/placeholder-logo.svg" alt="AI Career Tracker logo" />
          <span className="brand-text">AI Career Tracker</span>
        </div>
        <nav className="header-nav">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-cta" to="/register">Sign up</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-copy">
          <h1 className="hero-title">Track. Learn. Level up.</h1>
          <p className="hero-subtitle">Stay on top of your goals, logs, and skills with AI-powered insights, streaks, and analytics.</p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={handleStart}>{hasToken ? "Continue" : "Get Started"}</button>
            <Link className="cta-secondary" to="/login">I already have an account</Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/landing-hero.svg" alt="Product overview with charts and goals" className="hero-image" />
        </div>
      </main>

      <section className="feature-section">
        <div className="feature-grid">
          <article className="feature-card">
            <img src="/feature-analytics.svg" alt="Analytics charts" className="feature-icon" />
            <h3 className="feature-title">Actionable Analytics</h3>
            <p className="feature-text">Visualize your learning hours, streaks, and progress trends to stay motivated.</p>
          </article>
          <article className="feature-card">
            <img src="/feature-goals.svg" alt="Goal target" className="feature-icon" />
            <h3 className="feature-title">Goal Tracking</h3>
            <p className="feature-text">Create clear goals and break them into milestones you can actually achieve.</p>
          </article>
          <article className="feature-card">
            <img src="/feature-logs.svg" alt="Checklist logs" className="feature-icon" />
            <h3 className="feature-title">Simple Logging</h3>
            <p className="feature-text">Log your learning sessions quickly and watch your streaks grow.</p>
          </article>
          <article className="feature-card">
            <img src="/feature-portfolio.svg" alt="Portfolio showcase" className="feature-icon" />
            <h3 className="feature-title">Shareable Portfolio</h3>
            <p className="feature-text">Publish your achievements and skills with a public portfolio link.</p>
          </article>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2 className="cta-banner-title">Ready to accelerate your career?</h2>
          <div className="cta-banner-actions">
            <button className="cta-primary" onClick={handleStart}>Start free</button>
            <Link className="cta-secondary" to="/register">Create account</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p className="footer-text">© {new Date().getFullYear()} AI Career Tracker</p>
        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </footer>
    </div>
  )
}
