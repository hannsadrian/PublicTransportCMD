#!/usr/bin/env node

const monitor = require("./monitor")
const finder = require("./finder/finder")

var args = process.argv.slice(2);

if (args.length > 0) {
  args.forEach(arg => {
    switch (arg.toLowerCase()) {
      case "monitor":
        monitor.call();
        break;
        case "find":
        finder.call();
        break;
    }
  });
}
