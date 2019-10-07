#!/usr/bin/env node

const monitor = require("./monitor")
const finder = require("./finder/finder")


// ATTENTION: This is not the final version
// Proper command handling will be implemented in the future

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
  if (args[1].startsWith("st")) { // stop
    finder.call(true, true, false)
  } else if (args[1].startsWith("ad")) { // address
    finder.call(true, false, true)
  } else {
    finder.call()
  }
}