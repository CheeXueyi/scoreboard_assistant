# Scoreboard Assistant Frontend

A real-time team sport scoreboard with session-based multi-scoreboard support. Users create or join sessions via unique codes, allowing multiple independent scoreboards to sync in real-time.

## Features

- ✅ On-the-fly session creation with shareable codes
- ✅ Full-screen scoreboard display (red vs blue)
- ✅ Real-time score synchronization via WebSocket
- ✅ Multiple independent sessions (each with unique code)
- ✅ Large, blocky font (digital scoreboard style)
- ✅ Session codes for future input device configuration

## Tech Stack

- **React 19** - UI framework
- **React Router** - Multi-page navigation
- **TypeScript** - Type safety
- **Vite** - Build tool
- **WebSocket** - Real-time communication

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── pages/
│   ├── Home.tsx                # Session creation/join page
│   └── ScoreboardPage.tsx      # Individual scoreboard view
├── components/
│   └── ScoreTracker.tsx        # Scoreboard display component
├── services/
│   ├── api.ts                  # REST API (optional backup)
│   └── socket.ts               # WebSocket communication
├── utils/
│   └── session.ts              # Session code generation
├── styles/
│   ├── app.css                 # Scoreboard styling
│   ├── home.css                # Home page styling
│   ├── globals.css             # Global styles
│   └── scoreboard-page.css     # Scoreboard page styling
├── App.tsx                     # Router setup
└── main.tsx                    # React entry point
```

## How It Works

### User Flow

1. **User visits app** → Home page
2. **Create or Join:**
   - **Create**: Generates new 6-character code (e.g., `ABC-123`)
   - **Join**: Enters existing code to sync with other displays
3. **Start scoreboard** → All clients with same code sync in real-time
4. **Input devices** (future) → Use session code to configure physical controls

### Architecture

```
Frontend (Multiple Browser Tabs/Devices)
├─ Session: ABC-123 (Room ABC-123)
│  ├─ Scoreboard 1
│  ├─ Scoreboard 2
│  └─ Scoreboard 3 (all sync)
│
└─ Session: XYZ-789 (Room XYZ-789)
   ├─ Scoreboard A
   └─ Scoreboard B (independent from ABC-123)
```

## WebSocket Events

### Frontend → Backend

**Event: `updateScore`**
```json
{
  "sessionCode": "ABC-123",
  "teamA": 15,
  "teamB": 12
}
```

### Backend → Frontend

**Event: `scoreUpdate`**
```json
{
  "teamA": 15,
  "teamB": 12
}
```

## Backend Integration Guide

### Key Implementation Points

1. **Room Management**: Use WebSocket rooms for each session code
   ```typescript
   socket.join(sessionCode)  // Group clients by session
   ```

2. **Session Storage**: Keep scores in memory per sessionCode
   ```typescript
   const sessions = new Map<string, ScoreData>()
   sessions.set('ABC-123', { teamA: 15, teamB: 12 })
   ```

3. **Broadcast Logic**: Only send updates to clients in the same room
   ```typescript
   io.to(sessionCode).emit('scoreUpdate', scores)
   ```

4. **Initialization**: Send current scores when client connects
   ```typescript
   socket.on('joinSession', ({ sessionCode }) => {
     const scores = sessions.get(sessionCode) || { teamA: 0, teamB: 0 }
     socket.emit('scoreUpdate', scores)
   })
   ```

### Node.js + Express + Socket.IO Example

```typescript
import { Server } from 'socket.io'

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
})

// Store scores per session (in-memory)
const sessions = new Map<string, { teamA: number; teamB: number }>()

io.on('connection', (socket) => {
  socket.on('joinSession', ({ sessionCode }) => {
    socket.join(sessionCode)
    
    // Send current scores
    const scores = sessions.get(sessionCode) || { teamA: 0, teamB: 0 }
    socket.emit('scoreUpdate', scores)
  })

  socket.on('updateScore', ({ sessionCode, teamA, teamB }) => {
    // Update session scores
    sessions.set(sessionCode, { teamA, teamB })
    
    // Broadcast to all clients in this session
    io.to(sessionCode).emit('scoreUpdate', { teamA, teamB })
  })
})
```

### Python + Flask + Flask-SocketIO Example

```python
from flask_socketio import SocketIO, emit, join_room

socketio = SocketIO(app)
sessions = {}

@socketio.on('joinSession')
def on_join_session(data):
    session_code = data['sessionCode']
    join_room(session_code)
    
    scores = sessions.get(session_code, {'teamA': 0, 'teamB': 0})
    emit('scoreUpdate', scores)

@socketio.on('updateScore')
def on_update_score(data):
    session_code = data['sessionCode']
    scores = {'teamA': data['teamA'], 'teamB': data['teamB']}
    
    sessions[session_code] = scores
    emit('scoreUpdate', scores, room=session_code)
```

### Go + Gorilla WebSocket Example

```go
// Use rooms/channels to track sessions
var sessions = make(map[string]map[*websocket.Conn]bool)

func handleJoinSession(sessionCode string, conn *websocket.Conn) {
  if sessions[sessionCode] == nil {
    sessions[sessionCode] = make(map[*websocket.Conn]bool)
  }
  sessions[sessionCode][conn] = true
}

func broadcastScores(sessionCode string, scores ScoreData) {
  for conn := range sessions[sessionCode] {
    conn.WriteJSON(map[string]interface{}{
      "type": "scoreUpdate",
      "data": scores,
    })
  }
}
```

## Session Code Format

- **Format**: `XXX-XXX` (6 alphanumeric characters with dash)
- **Example**: `ABC-123`, `XYZ-789`, `DEF-456`
- **Characters**: A-Z and 0-9
- **Validation**: Frontend validates format before sending to backend

## Current State (Development)

The frontend currently uses **dummy WebSocket functions** to simulate backend communication:

- `connectSocket(sessionCode)` - Simulates connection
- `emitScoreUpdate()` - Logs score updates (doesn't send)
- `onScoreUpdate()` - Registers callback for updates

When your backend is ready, update [`services/socket.ts`](src/services/socket.ts) with actual Socket.IO implementation.

## Testing Without Backend

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. Click "Create New Session" → Gets code like `ABC-123`
3. Click "Start Scoreboard"
4. Try clicking to increase scores
5. Console will log score updates (dummy mode)

Open same URL in multiple browser tabs to see they would sync with a real backend.

## Environment Configuration

Create `.env.local`:
```env
VITE_SOCKET_URL=http://localhost:3000
```

Frontend defaults to `http://localhost:3000` if not set.

## Multi-Session Example

**Session 1: ABC-123**
- User 1: Opens `http://localhost:5173/scoreboard/ABC-123`
- User 2: Opens `http://localhost:5173/scoreboard/ABC-123`
- **Both sync together**

**Session 2: XYZ-789**
- User 3: Opens `http://localhost:5173/scoreboard/XYZ-789`
- **Independent from ABC-123**

## Input Device Configuration (Future)

Session codes will be used to:
- Register custom input devices (buttons, API endpoints)
- Configure device permissions
- Link physical controls to specific sessions

Example:
```
POST /api/devices/register
{
  "sessionCode": "ABC-123",
  "deviceId": "button-panel-01",
  "type": "button-grid"
}
```

## Troubleshooting

**Multiple scoreboards not syncing?**
- Verify they have the same session code
- Check WebSocket connection in browser console
- Confirm backend broadcasts to room correctly

**Session code keeps changing?**
- Session code resets on page refresh (in-memory, no persistence)
- Share the URL or write down the code before navigating

**Can't join existing session?**
- Verify session code format: `XXX-XXX`
- Check backend is storing sessions
- Ensure WebSocket connection is active

## Production Deployment

1. Build frontend:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to web server

3. Update `VITE_SOCKET_URL` to production backend URL

4. Ensure backend WebSocket is accessible from deployment URL

## Future Enhancements

- **Persistence**: Save sessions to database (TTL-based cleanup)
- **Input devices**: Register and manage physical controls per session
- **Webhooks**: Notify external systems of score changes
- **Game types**: Support different sport configurations
- **Admin panel**: Create/manage/monitor sessions
- **Analytics**: Track score history per session

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
