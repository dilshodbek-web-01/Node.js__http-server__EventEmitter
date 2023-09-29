const fs = require("fs").promises;

class Utils {
  this;
  constructor(dir) {
    this.dir = dir;
  }

  async read() {
    const file = await fs.readFile(this.dir, "utf8");
    return JSON.parse(file);
  }

  write(data) {
    return fs.writeFile(this.dir, JSON.stringify(data, null, 2));
  }
}

module.exports = Utils;
