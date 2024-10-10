import { createQueue } from 'kue';

const queue = createQueue();

const info = {
  phoneNumber: '123-456-789',
  message: 'This is a message',
}

const job = queue.create('push_notification_code', info).save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', () => {
  console.log('Notification job failed');
});
