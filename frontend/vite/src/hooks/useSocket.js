import { useEffect } from "react"
import { initializeSocket, disconnectSocket } from "../services/socketService"

export const useSocket = (userId) => {
  useEffect(() => {
    if (!userId) return

    const socket = initializeSocket(userId)

    return () => {
      disconnectSocket()
    }
  }, [userId])
}
