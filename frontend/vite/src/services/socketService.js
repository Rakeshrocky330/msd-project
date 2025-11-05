import io from "socket.io-client"

const API_BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

let socket = null

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(API_BASE_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
    socket.emit("user:login", userId)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })

  return socket
}

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized. Call initializeSocket first.")
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const on = (event, callback) => {
  if (socket) {
    socket.on(event, callback)
  }
}

export const off = (event, callback) => {
  if (socket) {
    socket.off(event, callback)
  }
}

export const emit = (event, data) => {
  if (socket) {
    socket.emit(event, data)
  }
}
