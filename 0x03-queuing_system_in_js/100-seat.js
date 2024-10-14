import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const client = createClient();
const queue = kue.createQueue();

let reservationEnabled = true;

client.on('connect', () => {
  console.log('Connected to Redis server');
}).on('error', (err) => {
  console.log(`Failed to connect to Redis server: ${err}`);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10);
}

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();

  return res.json({
    numberOfAvailableSeats: availableSeats
  });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) return res.json({ status: 'Reservation are blocked' });

  const job = queue.create('reserve_seat').save((err) => {
    if (!err) res.json({ status: 'Reservation in process' });
    else res.json({ status: 'Reservation failed' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });
  job.on('failed', (errMsg) => {
    console.log(`Seat reservation job ${job.id} failed: ${errMsg}`);
  });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();

    if (currentSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    await reserveSeat(currentSeats - 1);

    if (currentSeats - 1 <= 0) {
      reservationEnabled = false;
    }

    done();
  });
});

app.listen(1245, () => {
  console.log('Server is running');
  setAsync('available_seats', 50);
});
