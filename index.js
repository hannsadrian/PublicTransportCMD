#!/usr/bin/env node

const inquirer = require("inquirer");
const colors = require("colors");
const fetch = require("node-fetch");

async function getStopFromUser() {
  return new Promise((resolve, reject) => {
    var questions = [
      {
        type: "input",
        name: "stopName",
        message: "Input the name of your stop"
      }
    ];

    inquirer.prompt(questions).then(answers => {
      resolve(answers.stopName);
    });
  });
}

async function getStop(hst) {
  return new Promise((resolve, reject) => {
    fetch(
      "http://widgets.vvo-online.de/abfahrtsmonitor/Haltestelle.do?hst=" + hst
    ).then(res => resolve(res.json()));
  });
}

async function getDepartures(hst) {
  return new Promise((resolve, reject) => {
    fetch(
      "http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?hst=" + hst
    ).then(res => resolve(res.json()));
  });
}

async function executeCMD() {
  console.log("");
  console.log(colors.bold(colors.america("-------------------------")));
  console.log("");
  var stop = await getStopFromUser();
  console.log("");
  console.log(
    colors.italic(colors.yellow("-") + " Fetching Departures for ") +
      colors.italic(colors.cyan(stop))
  );
  var departures = await getDepartures(stop);
  var stopFound = await getStop(stop);
  console.log(
    colors.italic(colors.yellow("-") + " Found departures for ") +
      colors.italic(
        colors.cyan(JSON.stringify(stopFound[1][0][0]).replace(/"/g, ""))
      )
  );
  console.log("");
  var max = [0, 0, 3];
  departures.forEach(departure => {
    if (departure[0].length > max[0]) max[0] = departure[0].length;
    if (departure[1].length > max[1]) max[1] = departure[1].length;
    if (departure[2].length > max[2]) max[2] = departure[2].length;
  });
  var header = ["Linie", "Min"];
  for (i = 0; i < max[0] + max[1] + 1; i++) {
    if (header[0].length < max[0] + max[1] + 1) header[0] += " ";
  }
  console.log(
    colors.gray("  | ") +
      colors.white(header[0]) +
      colors.gray(" | ") +
      colors.white(header[1]) +
      colors.gray(" |")
  );
  departures.forEach(departure => {
    for (i = 0; i < departure.length; i++) {
      for (y = 0; y < max[i]; y++) {
        if (departure[i].length < max[i]) {
          departure[i] += " ";
        }
      }
    }

    if (departure[2] === "   ") departure[2] = "0  ";

    console.log(
      colors.gray("  | ") +
        colors.yellow(departure[0]) +
        colors.gray(" ") +
        colors.white(departure[1]) +
        colors.gray(" | ") +
        colors.white(departure[2]) +
        colors.gray(" |")
    );
  });
  console.log("");
  console.log(colors.bold(colors.america("-------------------------")));
}

executeCMD();
