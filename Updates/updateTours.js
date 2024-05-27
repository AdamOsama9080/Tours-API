const mongoose = require('mongoose');
const Tour = require('../Model/tourModel');

function updateToursWithPoints() {
  mongoose.connect('mongodb://localhost:27017/Trolli')
    .then(() => {
      return Tour.find({});
    })
    .then((tours) => {
      const values = [100, 150, 200];
      const tourUpdates = tours.map(tour => {
        const randomPoints = values[Math.floor(Math.random() * values.length)];
        tour.points = randomPoints;
        return tour.save();
      });

      return Promise.all(tourUpdates);
    })
    .then(() => {
      console.log('All tours updated with random points.');
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error updating tours:', error);
      mongoose.connection.close();
    });
}

updateToursWithPoints();
