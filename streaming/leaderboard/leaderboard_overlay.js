const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 10);
const authRequired = JSON.parse(urlParams.get("auth") || true);
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var tableHeaders = ["Rank", "Lifter", "Class", "Body weight", "Age", "Squat", "Bench", "Deadlift", "Total", "Points"];
var data;
var timeInSecs;
var ticker;

function startTimer(secs) {
  timeInSecs = parseInt(secs);
  ticker = setInterval("tick()", 1000);
}

function tick() {
  var secs = timeInSecs;
  if (secs > 0) {
    timeInSecs--;
    console.log("Refresh in " + secs);
  } else {
    console.log("Refreshed");
    clearInterval(ticker);
  }
}

function generateTableHead(table, headers) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of headers) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateRows(table, weightClass, data) {
  var rank = 1;
  for (let element of data) {
    let row = table.insertRow();
    let successfulSquatLifts = [];
    let successfulBenchLifts = [];
    let successfulDeadliftLifts = [];
    for (let header of tableHeaders) {
      let cell;
      let text;
      switch (header) {
        case "Rank":
          cell = row.insertCell();
          text = document.createTextNode(rank);
          cell.appendChild(text);
          rank = 1 + rank;
          break;
        case "Lifter":
          cell = row.insertCell();
          text = document.createTextNode(element.name);
          cell.appendChild(text);
          break;
        case "Class":
          cell = row.insertCell();
          text = document.createTextNode(weightClass);
          cell.appendChild(text);
          break;
        case "Body weight":
          cell = row.insertCell();
          text = document.createTextNode(element.bodyweightKg);
          cell.appendChild(text);
          break;
        case "Age":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
        case "Squat":
          cell = row.insertCell();
          successfulSquatLifts = [];
          for (let index = 0; index < element.squatStatus.length; index++) {
            const squatStatus = element.squatStatus[index];
            if (squatStatus == 1) {
              successfulSquatLifts.push(element.squatKg[index]);
            }
          }
          text = document.createTextNode(
            Math.max(...successfulSquatLifts) != -Infinity ? Math.max(...successfulSquatLifts) : 0
          );
          cell.appendChild(text);
          break;
        case "Bench":
          cell = row.insertCell();
          successfulBenchLifts = [];
          for (let index = 0; index < element.squatStatus.length; index++) {
            const squatStatus = element.squatStatus[index];
            if (squatStatus == 1) {
              successfulBenchLifts.push(element.squatKg[index]);
            }
          }
          text = document.createTextNode(
            Math.max(...successfulBenchLifts) != -Infinity ? Math.max(...successfulBenchLifts) : 0
          );
          cell.appendChild(text);
          break;
        case "Deadlift":
          cell = row.insertCell();
          successfulDeadliftLifts = [];
          for (let index = 0; index < element.squatStatus.length; index++) {
            const squatStatus = element.squatStatus[index];
            if (squatStatus == 1) {
              successfulDeadliftLifts.push(element.squatKg[index]);
            }
          }
          text = document.createTextNode(
            Math.max(...successfulDeadliftLifts) != -Infinity ? Math.max(...successfulDeadliftLifts) : 0
          );
          cell.appendChild(text);
          break;
        case "Total":
          cell = row.insertCell();
          text = document.createTextNode(
            Math.max(...successfulSquatLifts) +
              Math.max(...successfulBenchLifts) +
              Math.max(...successfulDeadliftLifts) !=
              -Infinity
              ? Math.max(...successfulSquatLifts) +
                  Math.max(...successfulBenchLifts) +
                  Math.max(...successfulDeadliftLifts)
              : 0
          );
          cell.appendChild(text);
          break;
        case "Points":
          cell = row.insertCell();
          text = document.createTextNode(element.points || 0);
          cell.appendChild(text);
          break;
      }
    }
  }
}

function generateTitle(sex, weightClass) {
  document.getElementById("leaderboardDescription").innerHTML = `Sex: ${sex} | Class: ${weightClass}`;
}

async function handleTableLoop(table, data) {
  for (const key in data) {
    for (const index in data[key]) {
      var sortedEntries = data[key][index]["entries"]
        .sort(function (a, b) {
          return a.points - b.points;
        })
        .reverse();
      table.innerHTML = "";
      generateTableHead(table, tableHeaders);
      generateTitle(key, data[key][index].weightClass);
      generateRows(table, data[key][index].weightClass, sortedEntries);
      await sleep(rotationTimeSeconds * 1000);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateTable() {
  var table = document.getElementById("leaderboardTable");
  if (authRequired == true) {
    fetchHeaders = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    };
  } else {
    fetchHeaders = {
      "Content-Type": "application/json",
    };
  }
  const response = await fetch(apiUrl + "/lifter/results", {
    method: "GET",
    headers: fetchHeaders,
  });
  const data = JSON.parse(await response.json());
  handleTableLoop(table, data);
}
