import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import PortfolioEditor from "../components/PortfolioEditor"
import PortfolioPreview from "../components/PortfolioPreview"
import "../styles/Portfolio.css"

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPortfolio(response.data)
    } catch (error) {
      toast.error("Error fetching portfolio")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePortfolio = async (updatedData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put("/api/portfolio", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPortfolio(response.data)
      setEditing(false)
      toast.success("Portfolio updated!")
    } catch (error) {
      toast.error("Error updating portfolio")
    }
  }

  const handleGenerateShare = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "/api/portfolio/generate-share",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setShareUrl(response.data.shareUrl)
      toast.success("Share link generated!")
    } catch (error) {
      toast.error("Error generating share link")
    }
  }

  const handleExportPDF = () => {
    const element = document.getElementById("portfolio-preview")
    const opt = {
      margin: 10,
      filename: "portfolio.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    }
    // Note: html2pdf library needs to be added to package.json
    toast.info("PDF export feature requires html2pdf library")
  }

  return (
    <div className="portfolio-page">
      <Navbar />
      <div className="portfolio-content">
        <div className="portfolio-header">
          <h1>Portfolio & Resume</h1>
          <div className="portfolio-actions">
            <button onClick={() => setEditing(!editing)} className="btn-edit">
              {editing ? "Cancel" : "Edit"}
            </button>
            <button onClick={handleGenerateShare} className="btn-share">
              Share Portfolio
            </button>
            <button onClick={handleExportPDF} className="btn-export">
              Export PDF
            </button>
          </div>
        </div>

        {shareUrl && (
          <div className="share-link-box">
            <p>Share your portfolio:</p>
            <input type="text" value={shareUrl} readOnly />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                toast.success("Link copied!")
              }}
            >
              Copy Link
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading portfolio...</p>
        ) : editing ? (
          <PortfolioEditor portfolio={portfolio} onSave={handleUpdatePortfolio} />
        ) : (
          <PortfolioPreview portfolio={portfolio} />
        )}
      </div>
    </div>
  )
}
