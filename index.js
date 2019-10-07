#!/usr/bin/env node

const monitor = require("./monitor")
const finder = require("./finder/finder")

var args = process.argv.slice(2);

if (args.length === 1) {
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
} else if (args.length === 2 && args[0] === "find") {
  if (args[1] === "stop") {
    console.log("stop")
    finder.call(true)
  } else {
    finder.call(false)
  }
}