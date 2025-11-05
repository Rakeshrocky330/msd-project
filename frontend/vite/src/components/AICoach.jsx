import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/AICoach.css"

export default function AICoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages([...messages, userMessage])
    setInput("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "/api/ai/chat",
        { message: input },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const aiMessage = { role: "assistant", content: response.data.response }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      toast.error("Failed to get AI response")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`ai-coach ${isOpen ? "open" : ""}`}>
      <button className="coach-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "×" : "AI Coach"}
      </button>

      {isOpen && (
        <div className="coach-window">
          <div className="coach-header">
            <h3>AI Learning Coach</h3>
          </div>

          <div className="coach-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>Hi! I'm your AI Learning Coach. Ask me anything about your learning journey!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && <div className="message assistant">Thinking...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="coach-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
