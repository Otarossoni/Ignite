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
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found!" });
  }

  request.customer = customer;

  return next();
}

// Funções
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type == "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

// Rota para criação de conta
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

// Rota para ver movimentações de conta específica
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.status(200).json(customer.statement);
});

// Rota para depositar valor em uma conta
app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

// Rota para sacar valor de uma conta
app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

// Rota para obter movimnetações por data
app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => {
    statement.created_at.toDateString() === new Date(dateFormat).toDateString();
  });

  return response.json(statement);
});

// Rota para atualizar uma conta
app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;

  return response.status(201).send();
});

// Rota para obter os dados da conta
app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer);
});

// Rota para deletar uma conta
app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1);

  return response.status(200).json(customers);
});

// Rota para obter o balance de uma conta
app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const balance = getBalance(customer.statement);

  return response.json(balance);
});

// Porta na qual a aplicação estará rodando
app.listen(3333);
