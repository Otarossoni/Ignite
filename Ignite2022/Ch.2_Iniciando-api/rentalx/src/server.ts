import express from 'express';
import { categoriesRoutes } from './routes/categories.routes';
const app = express();
app.use(express.json());

// Rota de Health Check
app.get('/', (request, response) => {
  return response.json({ message: 'Health Check' });
});

// Rotas de categorias
app.use(categoriesRoutes);

// Abertura da porta da aplicação
app.listen(3333, () => {
  console.log('Server is running!');
});
