const neo4j = require('neo4j-driver');
require('dotenv').config();

const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'sih_password'; // from docker-compose

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const closeDriver = async () => {
  await driver.close();
};

module.exports = {
  driver,
  closeDriver
};
