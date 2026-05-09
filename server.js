import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let games = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_game", (gameId, userData) => {
    socket.join(gameId);
    console.log(`User ${userData.name} joined game ${gameId}`);
    
    if (!games[gameId]) {
      games[gameId] = {
        id: gameId,
        players: [],
        status: 'WAITING'
      };
    }
    
    games[gameId].players.push({ ...userData, id: socket.id });
    io.to(gameId).emit("game_update", games[gameId]);
  });

  socket.on("play_card", (gameId, card) => {
    console.log(`Card played in ${gameId}:`, card);
    io.to(gameId).emit("card_played", { card, playerId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
