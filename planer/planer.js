const inquirer = require("inquirer");
const colors = require("colors");
const dvb = require("dvbjs");

function run(fromStop, toStop) {
    executeCMD(fromStop, toStop);
}


async function getOriginOrDestFromUser(origin, destination) {
    return new Promise((resolve, reject) => {
        questions = [];
        questions.push({
            type: "input",
            name: "origin",
            message: "Input the origin."
        });
        questions.push({
            type: "input",
            name: "destination",
            message: "Input the destination."
        });
        inquirer.prompt(questions).then((answers) => {
            resolve(answers);
        });
    });
}



async function executeCMD(fromStop, toStop) {
    var input = await getOriginOrDestFromUser(fromStop, toStop);
    var origin = "";
    var destination = "";

    await dvb.findStop(input.origin).then((data) => {
        origin = data[0]["id"];
    });

    await dvb.findStop(input.destination).then((data) => {
        destination = data[0]["id"];
    });

    const startTime = new Date();
    const isArrivalTime = false;
    const starLine = "******************************************************************************************";

    dvb.route(origin, destination, startTime, isArrivalTime).then((data) => {
        if (data["trips"][0] != null) {
            console.log(colors.america(starLine));
            console.log("Route from " + data["origin"]["name"] + "/" + data["origin"]["city"] + " to " + data["destination"]["name"] + "/" + data["destination"]["city"]);
            console.log(colors.america(starLine));
            console.log("");
            console.log("");

            for (var j = 0; j < data["trips"][0]["nodes"].length; j++) {
                var departureName = data["trips"][0]["nodes"][j]["departure"]["name"] + "/" + data["trips"][0]["nodes"][j]["departure"]["city"];
                var departureTime = data["trips"][0]["nodes"][j]["departure"]["time"];

                console.log("Departing from " + departureName + " on " + departureTime);
                console.log(colors.red(starLine));

                if (data["trips"][0]["nodes"][j]["stops"].length > 0) {
                    for (var i = 0; i < data["trips"][0]["nodes"][j]["stops"].length; i++) {
                        var currentStop = data["trips"][0]["nodes"][j]["stops"][i];
                        console.log(colors.green("************************************** Stop no " + (i + 1) + " *****************************************"));
                        console.log(currentStop["name"] + "/" + currentStop["city"]);
                        console.log("on " + currentStop["platform"]["type"] + " " + currentStop["platform"]["name"]);
                        console.log("arrival " + currentStop["arrival"]);
                        console.log("departure " + currentStop["departure"]);
                        console.log(colors.green(starLine));
                    }
                }
                else {
                    var currentStop = data["trips"][0]["nodes"][j];
                    console.log(currentStop["mode"]["title"]);
                    console.log("taking " + currentStop["duration"] + " minutes");
                    console.log(colors.green(starLine));
                }
                console.log(colors.red(starLine));
            }
        }
    });
}
module.exports = run
