const inquirer = require("inquirer");
const colors = require("colors");
const dvb = require("dvbjs");
const moment = require("moment");
require("moment-duration-format");

async function run() {
    await executeCMD()
}

async function getStopFromUser() {
    return new Promise((resolve, reject) => {
        var questions = [{
            type: "input",
            name: "stopName",
            message: "Input the name of your stop"
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

    // Find stop and monitor it
    var stopID = "";
    var stopFound = await dvb.findStop(stop).then((data) => {
        stopID = data[0].id;
        return data[0].name + ", " + data[0].city;
    });

    var departures = await dvb.monitor(stopID, 0, 10).then((data) => {
        return data;
    });

    console.log(
        colors.italic("  Departures for ") + colors.italic(colors.cyan(stopFound))
    );
    console.log("");

    // Figure out max width for table entry
    var maxWidths = [0, 0, 3];
    departures.forEach((departure) => {
        if (departure.line.length > maxWidths[0])
            maxWidths[0] = departure.line.length;
        if (departure.direction.length > maxWidths[1])
            maxWidths[1] = departure.direction.length;
        if (
            moment
            .duration(departure.arrivalTimeRelative, "minutes")
            .format("d[d] h[h] m[m]").length > maxWidths[2]
        )
            maxWidths[2] = moment
            .duration(departure.arrivalTimeRelative, "minutes")
            .format("d[d] h[h] m[m]").length;
    });
    var header = ["Line", "Min"];
    for (i = 0; i < maxWidths[0] + maxWidths[1] + 1; i++) {
        if (header[0].length < maxWidths[0] + maxWidths[1] + 1) header[0] += " ";
    }

    // Print stuff to console
    console.log(
        colors.gray("  | ") +
        colors.white(header[0]) +
        colors.gray(" | ") +
        colors.white(header[1]) +
        colors.gray(" |")
    );

    departures.forEach((departure) => {
        if (departure.arrivalTimeRelative < 0) {
            return;
        }
        console.log(
            colors.gray("  | ") +
            colors.yellow(
                departure.line + getWhiteSpaces(maxWidths[0] - departure.line.length)
            ) +
            colors.white(
                departure.direction +
                getWhiteSpaces(maxWidths[1] - departure.direction.length)
            ) +
            colors.gray("| ") +
            colors.white(
                moment
                .duration(departure.arrivalTimeRelative, "minutes")
                .format("d[d] h[h] m[m]") +
                getWhiteSpaces(
                    maxWidths[2] -
                    moment
                    .duration(departure.arrivalTimeRelative, "minutes")
                    .format("d[d] h[h] m[m]").length
                )
            ) +
            colors.gray("|")
        );
    });

    console.log("");
    console.log(colors.bold(colors.america("-------------------------")));
}

module.exports = run