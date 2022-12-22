// Importações complementares
const { v4: uuidv4 } = require("uuid");

// Importações obrigatórias do Express
const express = require("express");
const app = express();
app.use(express.json());

// Array para uso da API em memória
const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.params;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found!" });
  }

  console.log(customer);

  request.customer = customer;

  return next();
}

app.post("/account", (request, response) => {
  // Busca os parametros da requisição
  const { cpf, name } = request.body;

  // Valida se o customer já existe, através de seu CPF
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  // Adiciona o customer na lista
  customers.push({ cpf, name, id: uuidv4(), statement: [] });
  console.log(customers);

  // Retorna o resultado
  return response.status(201).send();
});

app.get("/statement/:cpf", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.status(200).json(customer.statement);
});

// Porta na qual a aplicação estará rodando
app.listen(3333);
