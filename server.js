'use strict';

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

/* =========================
   APP INIT
========================= */

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/* =========================
   MIDDLEWARE
========================= */

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* =========================
   IN-MEMORY SYSTEM STATE
========================= */

const SYSTEM = {
  sessions: new Map(),
  agents: new Map(),
  smokeEvents: [],
  orbitState: new Map(),
  memoryGraph: new Map()
};

/* =========================
   AI CORE ROUTER (SIMPLIFIED)
========================= */

async function aiRouter({ input, sessionId, userId }) {
  const intent = classifyIntent(input);

  const response = {
    id: uuidv4(),
    sessionId,
    userId,
    intent,
    message: '',
    smoke: null,
    orbit: null,
    timestamp: Date.now()
  };

  switch (intent.type) {
    case 'commerce':
      response.message = "Commerce agent activated: generating product flow...";
      response.smoke = generateSmoke('commerce');
      response.orbit = triggerOrbit('STORE');
      break;

    case 'creative':
      response.message = "Design agent engaged: initializing creation pipeline...";
      response.smoke = generateSmoke('creative');
      response.orbit = triggerOrbit('DESIGN');
      break;

    case 'navigation':
      response.message = "Routing orbital navigation system...";
      response.smoke = generateSmoke('navigation');
      response.orbit = triggerOrbit(intent.target || 'AI');
      break;

    case 'chat':
    default:
      response.message = `GanjaGoddessAI: I hear you — processing intent: ${intent.raw}`;
      response.smoke = generateSmoke('chat');
      response.orbit = triggerOrbit('AI');
      break;
  }

  return response;
}

/* =========================
   INTENT ENGINE
========================= */

function classifyIntent(input) {
  const text = input.toLowerCase();

  if (text.includes('buy') || text.includes('shop') || text.includes('price')) {
    return { type: 'commerce', raw: input };
  }

  if (text.includes('design') || text.includes('create') || text.includes('build')) {
    return { type: 'creative', raw: input };
  }

  if (text.includes('go to') || text.includes('open') || text.includes('navigate')) {
    return { type: 'navigation', raw: input, target: detectTarget(text) };
  }

  return { type: 'chat', raw: input };
}

function detectTarget(text) {
  if (text.includes('store')) return 'STORE';
  if (text.includes('ai')) return 'AI';
  if (text.includes('design')) return 'DESIGN';
  return 'AI';
}

/* =========================
   SMOKE ENGINE (EVENT LAYER)
========================= */

function generateSmoke(type) {
  const base = {
    id: uuidv4(),
    type,
    intensity: Math.random() * 1,
    particles: Math.floor(Math.random() * 100 + 50),
    color:
      type === 'commerce'
        ? '#00ff99'
        : type === 'creative'
        ? '#ffd700'
        : '#00ccff',
    timestamp: Date.now()
  };

  SYSTEM.smokeEvents.push(base);
  return base;
}

/* =========================
   ORBIT ENGINE (UI STATE)
========================= */

function triggerOrbit(node) {
  const orbit = {
    id: uuidv4(),
    node,
    velocity: Math.random() * 2 + 0.5,
    radius: Math.random() * 50 + 100,
    timestamp: Date.now()
  };

  SYSTEM.orbitState.set(node, orbit);
  return orbit;
}

/* =========================
   SOCKET REALTIME LAYER
========================= */

io.on('connection', (socket) => {
  const sessionId = uuidv4();

  SYSTEM.sessions.set(sessionId, {
    socketId: socket.id,
    created: Date.now()
  });

  socket.emit('session:init', { sessionId });

  socket.on('ai:input', async (payload) => {
    const { input, userId } = payload;

    const result = await aiRouter({
      input,
      sessionId,
      userId
    });

    socket.emit('ai:response', result);
    io.emit('smoke:update', result.smoke);
    io.emit('orbit:update', result.orbit);
  });

  socket.on('disconnect', () => {
    SYSTEM.sessions.delete(sessionId);
  });
});

/* =========================
   API ROUTES
========================= */

app.get('/', (req, res) => {
  res.json({
    system: 'GanjaGoddessAI Ghost Engine',
    status: 'active',
    uptime: process.uptime()
  });
});

app.post('/api/ai', async (req, res) => {
  const { input, userId } = req.body;

  const result = await aiRouter({
    input,
    sessionId: uuidv4(),
    userId
  });

  res.json(result);
});

app.get('/api/system/state', (req, res) => {
  res.json({
    sessions: SYSTEM.sessions.size,
    smokeEvents: SYSTEM.smokeEvents.length,
    orbitNodes: SYSTEM.orbitState.size
  });
});

/* =========================
   AGENT HOOK PLACEHOLDER
========================= */

function spawnAgent(type) {
  const agent = {
    id: uuidv4(),
    type,
    status: 'idle',
    created: Date.now()
  };

  SYSTEM.agents.set(agent.id, agent);
  return agent;
}

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🌌 GanjaGoddessAI server running on port ${PORT}`);
});