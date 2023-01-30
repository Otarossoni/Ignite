import express from "express";
import { createCourse } from "./routes";

const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Check" });
});

app.get("/createCourse", createCourse);

app.listen(3333);
