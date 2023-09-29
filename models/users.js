class User {
  id;
  name;
  budget;
  password;
  constructor(id, name, budget, password) {
    this.id = id;
    this.name = name;
    this.budget = budget;
    this.password = password;
  }
}

module.exports = User;
