import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

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

const client = createClient();

client.on('connect', () => {
  console.log('Connected to Redis server');
}).on('error', (err) => {
  console.log(`Failed to connect to Redis server: ${err}`);
});


function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

const getAsync = promisify(client.get).bind(client);

async function getCurrentReservedStockById(itemId) {

  try {
    const stock = await getAsync(`item.${itemId}`);
    if (stock) return parseInt(stock, 10);
  } catch(err) {
    console.log(err);
  }

  return null;
}

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);

  if (!item) return res.json({ 'status': 'Product not found' });

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = reservedStock !== null ? reservedStock : item.stock;

  return res.json({
    itemId: item.Id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: currentQuantity
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);

  if (!item) return res.json({ 'status': 'Product not found' });

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = reservedStock !== null ? reservedStock : item.stock;

  if (currentQuantity < 1) {
    return res.json({
      'status': 'Not enough stock available',
      'itemId': itemId
    });
  }

  reserveStockById(itemId, currentQuantity - 1);

  return res.json({
    'status': 'Reservation confirmed',
    'itemId': itemId
  });
});

app.listen(1245, () => console.log('Server is running'));
