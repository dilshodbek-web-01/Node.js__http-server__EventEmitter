const { EventEmitter } = require("events");
const ee = new EventEmitter();

const Utils = require("./utils");
const dbUsers = new Utils("./db/users.json");
const dbCompanies = new Utils("./db/companies.json");

ee.on("pay", async ({ fromId, toId, amount }, allDbUsers, allDbCompanies) => {

  allDbUsers[fromId - 1].budget -= amount;
  allDbCompanies[toId - 1].budget += amount;
  
  dbUsers.write([...allDbUsers]);
  dbCompanies.write([...allDbCompanies]);
});

ee.on("payToUser", async ({ fromId, toId, amount }, allDbUsers) => {

  allDbUsers[fromId - 1].budget -= amount;
  allDbUsers[toId - 1].budget += amount;
  
  dbUsers.write([...allDbUsers]);
});

module.exports = ee;
