const { rebuildDB } = require('./seedData');
const client = require('./client');

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());