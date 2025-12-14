/**
 * WebSocket Service
 * 
 * This service handles real-time communication with the backend via WebSocket.
 * Each session has its own room - only clients with the same sessionCode receive updates.
 * 
 * Currently uses dummy functions for development. Replace with actual socket.io
 * implementation when backend is ready.
 */

export interface ScoreData {
  teamA: number
  teamB: number
}

type ScoreUpdateCallback = (scores: ScoreData) => void

let scoreUpdateCallback: ScoreUpdateCallback | null = null
let isConnected = false
let currentSessionCode = ''

/**
 * Connect to WebSocket server with a specific session code
 * 
 * BACKEND IMPLEMENTATION:
 * Replace this with actual socket.io connection:
 * ```typescript
 * import { io } from 'socket.io-client'
 * const socket = io('http://your-backend:3000')
 * socket.emit('joinSession', { sessionCode })
 * ```
 */
export function connectSocket(sessionCode: string): Promise<void> {
  currentSessionCode = sessionCode
  
  return new Promise((resolve) => {
    console.log(`Connecting to session: ${sessionCode}`)
    
    // Dummy implementation - simulates connection
    setTimeout(() => {
      isConnected = true
      console.log(`Connected to session: ${sessionCode}`)
      resolve()
    }, 500)
  })
}

/**
 * Listen for score updates from server
 * 
 * BACKEND IMPLEMENTATION:
 * The backend should emit 'scoreUpdate' events when scores change:
 * ```typescript
 * socket.on('scoreUpdate', (scores: ScoreData) => {
 *   callback(scores)
 * })
 * ```
 */
export function onScoreUpdate(callback: ScoreUpdateCallback): void {
  scoreUpdateCallback = callback
  console.log('Listening for score updates')
}

/**
 * Emit score update to server
 * 
 * BACKEND IMPLEMENTATION:
 * The backend should listen for 'updateScore' events:
 * ```typescript
 * socket.on('updateScore', (data: { sessionCode, teamA, teamB }) => {
 *   // Update scores for this specific session
 *   sessions[sessionCode] = { teamA, teamB }
 *   // Broadcast to all clients in this session
 *   io.to(sessionCode).emit('scoreUpdate', { teamA, teamB })
 * })
 * ```
 */
export function emitScoreUpdate(teamA: number, teamB: number): void {
  if (!isConnected) {
    console.warn('Not connected to backend')
    return
  }

  console.log(`[${currentSessionCode}] Emitting score update:`, { teamA, teamB })
  
  // Dummy implementation - just logs the update
  // In production, this would send to backend via socket.emit()
}

/**
 * Trigger a score update callback (for testing/dummy mode)
 * 
 * BACKEND IMPLEMENTATION:
 * This is automatically called by the backend via socket.io
 * Not needed in production.
 */
export function simulateScoreUpdate(scores: ScoreData): void {
  if (scoreUpdateCallback) {
    scoreUpdateCallback(scores)
  }
}

/**
 * Disconnect from server
 * 
 * BACKEND IMPLEMENTATION:
 * Call disconnect on the socket instance:
 * ```typescript
 * socket.disconnect()
 * ```
 */
export function disconnectSocket(): void {
  if (isConnected) {
    isConnected = false
    console.log(`Disconnected from session: ${currentSessionCode}`)
    currentSessionCode = ''
  }
}

/**
 * Check connection status
 */
export function isSocketConnected(): boolean {
  return isConnected
}

/**
 * Get current session code
 */
export function getSessionCode(): string {
  return currentSessionCode
}
