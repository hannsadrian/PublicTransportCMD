#!/usr/bin/env node

const inquirer = require("inquirer");
const colors = require("colors");

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

async function getDepartures() {
  console.log(colors.bold(colors.america("-------------------------")));
  var stop = await getStopFromUser();
  console.log(colors.bold(colors.america("-------------------------")));
  console.log(
    colors.italic(
      colors.bold(colors.green("+")) + " Fetching Departures for "
    ) + colors.italic(colors.cyan(stop))
  );
  console.log(colors.bold(colors.america("-------------------------")));
}

getDepartures();
