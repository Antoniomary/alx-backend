import { createClient, print } from 'redis';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.message);
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, resp) => { ;
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      print(`Reply: ${resp}`);
    }
  });
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error(`Error getting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(value);
    }
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
