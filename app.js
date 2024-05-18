import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import checkToken from "./middlewares/checkToken.js";

const DB_URI = process.env.DB_URI;
const app = express();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));
app.use("/users", checkToken, usersRouter);
app.use("/api/contacts", checkToken, contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log("Server is running. Use our API on port: 3000");
});
