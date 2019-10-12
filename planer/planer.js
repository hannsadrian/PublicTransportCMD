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
				departure = data["trips"][0]["nodes"][j]["departure"];
				arrival = data["trips"][0]["nodes"][j]["arrival"];
				mode = data["trips"][0]["nodes"][j]["mode"];
				line = data["trips"][0]["nodes"][j]["line"];
				direction = data["trips"][0]["nodes"][j]["direction"];
				
				if(departure["name"] != null) {
					var departureName = departure["name"] + "/" + departure["city"];
				}
				var departureTime = new Date(departure["time"]).toLocaleString();
				
				if(data["trips"][0]["nodes"][j]["arrival"]["name"] != null) {
					var arrivalName = arrival["name"] + "/" + arrival["city"];
				}
				var arrivalTime = new Date(arrival["time"]).toLocaleString();

				console.log(colors.red(starLine));
                console.log("Departing from " + departureName + " on " + departureTime);
				console.log("on " + departure["platform"]["type"] + " " + departure["platform"]["name"]);
				console.log("means of transport " + mode["title"] + " / " + mode["name"]);
				console.log("line " + line);
				console.log("direction " + direction);
				console.log("Arriving at " + arrivalName + " on " + arrivalTime);
				console.log("on " + arrival["platform"]["type"] + " " + arrival["platform"]["name"]);
                console.log(colors.red(starLine));
            }
        }
    });
}
module.exports = run
