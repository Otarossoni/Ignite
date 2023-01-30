// Importações obrigatórias do Express
const express = require("express");
const app = express();
app.use(express.json());

// Porta na qual a aplicação estará rodando
app.listen(3333);

app.get("/courses", (request, response) => {
  response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/courses", (request, response) => {
  response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/courses/:id", (request, response) => {
  response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/courses/:id", (request, response) => {
  response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"]);
});

app.delete("/courses/:id", (request, response) => {
  response.json(["Curso 6", "Curso 7", "Curso 4"]);
});
