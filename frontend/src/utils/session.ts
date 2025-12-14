/**
 * Utility functions for session management
 */

/**
 * Generate a random 6-character session code
 * Format: XXX-XXX (e.g., "ABC-123")
 */
export function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
    if (i === 2) code += '-' // Add dash after 3 characters
  }
  
  return code
}

/**
 * Validate session code format
 */
export function isValidSessionCode(code: string): boolean {
  return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code)
}
