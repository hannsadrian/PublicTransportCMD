const inquirer = require("inquirer");
const colors = require("colors");
const dvb = require("dvbjs");

async function run() {
  await executeCMD()
}

async function getStopFromUser() {
  return new Promise((resolve, reject) => {
    var questions = [{
      type: "input",
      name: "stopName",
      message: "Input the name of the stop you want to find"
    }];

    inquirer.prompt(questions).then((answers) => {
      resolve(answers.stopName);
    });
  });
}

function getWhiteSpaces(amount) {
  offset = 1;
  amount += offset;
  var output = "";
  for (i = 0; i < amount; i++) {
    output += " ";
  }
  return output;
}



async function executeCMD() {
  console.log("");
  console.log(colors.bold(colors.america("-------------------------")));
  console.log("");

  var stop = await getStopFromUser();

  console.log("");

  var stops = await dvb.findPOI(stop)

  console.log(
    colors.italic("  Results for ") + colors.italic(colors.cyan(stops[0].name + ", " + stops[0].city))
  );
  console.log("");

  // Figure out max width for table entry
  var maxWidths = [0, 0];
  stops.forEach((stop) => {
    if (stop.type.length > maxWidths[0])
      maxWidths[0] = stop.type.length;
    if (stop.name.length > maxWidths[1])
      maxWidths[1] = stop.name.length;
  })
  var header = ["Type", "Name"];
  for (i = 0; i < maxWidths[0] + 1; i++) {
    if (header[0].length < maxWidths[0] + 1) header[0] += " ";
  }


  // Print stuff to console
  console.log(
    colors.gray("  | ") +
    colors.white(header[0]) +
    colors.gray(" | ") +
    colors.white(header[1])
  );

  stops.forEach((stop) => {
    console.log(
      colors.gray("  | ") +
      colors.yellow(
        stop.type + getWhiteSpaces(maxWidths[0] - stop.type.length)
      ) +
      colors.gray(" | ") +
      colors.white(
        stop.name +
        getWhiteSpaces(maxWidths[1] - stop.name.length)
      )
    );
  });

  console.log("");
  console.log(colors.bold(colors.america("-------------------------")));
}

module.exports = run