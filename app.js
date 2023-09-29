const http = require("http");

const Utils = require("./utils/utils");
const ee = require("./utils/events");
const User = require("./models/users");
const Companies = require("./models/companies");

const dbUsers = new Utils("./db/users.json");
const dbCompanies = new Utils("./db/companies.json");

const bodyParser = (request) => {
  return new Promise((resolve, reject) => {
    try {
      request.on("data", (chunk) => {
        resolve(JSON.parse(chunk));
      });
    } catch (error) {
      reject();
    }
  });
};

const io = async (request, response) => {
  if (request.url === "/add/users" && request.method === "POST") {
    const { name, budget, password } = await bodyParser(request);
    const allUsers = await dbUsers.read();
    const allUsersCount = allUsers.length;
    const newUser = new User(allUsersCount + 1, name, budget, password);
    dbUsers.write([...allUsers, newUser]);

    response.writeHead(201, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "qo`shildi." }));

  } else if (request.url === "/add/company" && request.method === "POST") {
    const { name, budget } = await bodyParser(request);
    const allCompanies = await dbCompanies.read();
    const allCompaniesCount = allCompanies.length;
    const newCompany = new Companies(allCompaniesCount + 1, name, budget);
    dbCompanies.write([...allCompanies, newCompany]);

    response.writeHead(201, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "qo`shildi." }));

  } else if (request.url === "/userToCompany" && request.method === "POST") {
    const { fromUser, toCompany, amount } = await bodyParser(request);

    const allDbUsers = await dbUsers.read();
    const allDbCompanies = await dbCompanies.read();

    const findUsers = allDbUsers.find((user) => {
      return user.id === fromUser;
    });

    const findCompany = allDbCompanies.find((company) => {
      return company.id === toCompany;
    });

    if (findUsers.budget < amount) {
      response.writeHead(200, {
        "Content-Type": "Application/json",
      });
      return response.end(JSON.stringify({ message: "Mablag` yetarli emas."}));
    }

    ee.emit(
      "pay",
      { fromId: findUsers.id, toId: findCompany.id, amount },
      allDbUsers,
      allDbCompanies
    );

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "To`landi." }));

  } else if (request.url === "/userToUser" && request.method === "POST") {
    const { fromUser, toUser, amount } = await bodyParser(request);

    const allDbUsers = await dbUsers.read();

    const findUserOne = allDbUsers.find((user) => {
      return user.id === fromUser;
    });

    const findUserTwoo = allDbUsers.find((user) => {
      return user.id === toUser;
    });
    
    if (findUserOne.budget < amount) {
      response.writeHead(200, {
        "Content-Type": "Application/json",
      });
      return response.end(JSON.stringify({ message: "Mablag` yetarli emas."}));
    }

    ee.emit(
      "payToUser",
      { fromId: findUserOne.id, toId: findUserTwoo.id, amount }, allDbUsers);

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "To`landi." }));

  } else if (request.url === "/get/users" && request.method === "GET") {
    const allUsers = await dbUsers.read();
    const allReadUsers = allUsers.filter((users) => {
      return users;
    });

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify(allReadUsers));

  } else if (request.url === "/get/companies" && request.method === "GET") {
    const allCompanies = await dbCompanies.read();
    const allReadCompanies = allCompanies.filter((companies) => {
      return companies;
    });

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify(allReadCompanies));
  }
};

http.createServer(io).listen(5599, () => {
  console.log("Ishlamoqda.");
});
