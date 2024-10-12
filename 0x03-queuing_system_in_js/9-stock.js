import express from 'express';
import createClient from 'redis';

const app = express();

const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

function getItemById(id) {
  return listProducts.find((product) => product.Id === id);
}

app.get('/list_products', (req, res) => {
  const formatted_listProducts = [];

  listProducts.forEach((product) => {
    formatted_listProducts.push({
      itemId: product.Id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock
    });
  });

  res.json(formatted_listProducts);
});

app.listen(1245, () => {
  console.log('Server is running');
});

const client = createClient();

client.on('connect', () => {
  console.log('Connected to the redis server');
}).on('error', (err) => {
  console.log(`Error: failed to connect to redis server: ${err}`);
});
