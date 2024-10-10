const mongoose = require('mongoose');
const { DB_URI } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    // Test ping by executing a simple query
    mongoose.connection.db.command({ ping: 1 })
      .then(() => console.log('✅ MongoDB ping successful'))
      .catch((pingErr) => console.error('❌ MongoDB ping error:', pingErr));

  })
  .catch((connErr) => {
    console.error('❌ MongoDB connection error:', connErr);
  });

  

module.exports = mongoose.connection;
