import { createQueue } from 'kue';

const queue = createQueue();

function sendNotification(phoneNumber, message) {
  const r = `Sending notification to ${phoneNumber}, with message: ${message}`;
  console.log(r);
}

queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});
