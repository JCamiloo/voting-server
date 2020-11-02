const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('The Weeknd'));
bands.addBand(new Band('Lewis Capaldi'));
bands.addBand(new Band('Daniel Caesar'));
bands.addBand(new Band('Dean Lewis'));

io.on('connection', client => {
  console.log('Client connected');

  client.emit('active-bands', bands.getBands());

  client.on('disconnect', () => {
    console.log('Client disconnected');
  });

  client.on('message', (payload) => {
    console.log(payload);
    io.emit('message', {message: `Message received from ${payload.name}`})
  });

  client.on('vote-band', (payload) => {
    bands.voteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  });

  client.on('add-band', (payload) => {
    const newBand = new Band(payload.name);
    bands.addBand(newBand);
    io.emit('active-bands', bands.getBands());
  });

  client.on('delete-band', (payload) => {
    bands.deleteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  });
});