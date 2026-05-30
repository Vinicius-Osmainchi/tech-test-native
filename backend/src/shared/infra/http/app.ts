import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./swagger";

const app = express();
app.set("trust proxy", 1);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.set("io", io);

setupSwagger(app);

app.use(router);
app.use(errorHandler);

export { server };
