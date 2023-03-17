const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 10);
const authRequired = JSON.parse(urlParams.get("auth") || true);
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var tableHeaders = [
  "Rank",
  "Lifter",
  "Division",
  "Class",
  "Body weight",
  "Age",
  "Squat",
  "Bench",
  "Deadlift",
  "Total",
  "Points",
];
var data;
var timeInSecs;
var ticker;

function startTimer(secs, table, key, data) {
  timeInSecs = parseInt(secs);
  generateRows(table, data[key]);
  ticker = setInterval(tick, 1000);
}

function tick(table, key, data) {
  var secs = timeInSecs;
  if (secs > 0) {
    timeInSecs--;
    console.log("Refresh in " + secs);
  } else {
    console.log("Rotating");
    timeInSecs = rotationTimeSeconds;
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

function generateRows(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(element[key]);
    cell.appendChild(text);
  }
}

function generateTitle(sex, weightClass) {
  document.getElementById("leaderboardDescription").innerHTML = `Sex: ${sex} | Class: ${weightClass}`;
}

function handleTableLoop(table, sex, data) {
  for (const key in data) {
    console.log(key);
    generateTitle(sex, key);
    startTimer(rotationTimeSeconds, table, key, data);
  }
}

async function generateTable() {
  var table = document.getElementById("leaderboardTable");
  generateTableHead(table, tableHeaders);
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
  for (const key in data) {
    console.log(key);
    handleTableLoop(table, key, data[key]);
  }
}
