const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 10);
const authRequired = JSON.parse(urlParams.get("auth") || true);
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var tableHeaders = ["Rank", "Lifter", "Class", "Body weight", "Age", "Squat", "Bench", "Deadlift", "Total", "Points"];
var data;
var timeInSecs;
var ticker;

function startTimer(secs, table, weightClass, data) {
  timeInSecs = parseInt(secs);

  //ticker = setInterval(tick, 1000);
}

function tick(table, key, data) {
  var secs = timeInSecs;
  if (secs > 0) {
    timeInSecs--;
    console.log("Refresh in " + secs);
  } else {
    console.log("Rotating");
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
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
        case "Bench":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
        case "Deadlift":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
        case "Total":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
        case "Points":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.appendChild(text);
          break;
      }
    }
  }
}

function generateTitle(sex, weightClass) {
  document.getElementById("leaderboardDescription").innerHTML = `Sex: ${sex} | Class: ${weightClass}`;
}

function handleTableLoop(table, sex, data) {
  for (const index in data) {
    var sortedEntries = data[index]["entries"]
      .sort(function (a, b) {
        return a.points - b.points;
      })
      .reverse();
    generateTitle(sex, data[index].weightClass);
    generateRows(table, data[index].weightClass, sortedEntries);
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
    handleTableLoop(table, key, data[key]);
  }
}
