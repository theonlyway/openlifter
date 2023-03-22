const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 15);
const authRequired = JSON.parse(urlParams.get("auth") || true);
const entriesPerTable = parseInt(urlParams.get("entries_per_table") || 5);
const entriesGrouping = urlParams.get("entries_grouping") || "points";
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var tableHeaders = ["Rank", "Lifter", "Class", "Body weight", "Age", "Squat", "Bench", "Deadlift", "Total", "Points"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var data;
var inKgs;

function kgToLbs(kgs) {
  return Math.floor(kgs * 2.20462);
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

function generateRows(table, weightClass = null, data, chunk) {
  var rank = entriesPerTable * chunk + 1;
  var tBody = table.getElementsByTagName("tbody")[0];
  for (let element of data) {
    let row = tBody.insertRow();
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
          cell.className = header;
          cell.appendChild(text);
          rank = 1 + rank;
          break;
        case "Lifter":
          cell = row.insertCell();
          text = document.createTextNode(element.name);
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Class":
          cell = row.insertCell();
          text = document.createTextNode(weightClass === null ? element.weightClass : weightClass);
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Body weight":
          cell = row.insertCell();
          text = document.createTextNode(element.bodyweightKg);
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Age":
          cell = row.insertCell();
          text = document.createTextNode(element.age);
          cell.className = header;
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
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Bench":
          cell = row.insertCell();
          successfulBenchLifts = [];
          for (let index = 0; index < element.benchStatus.length; index++) {
            const squatStatus = element.benchStatus[index];
            if (squatStatus == 1) {
              successfulBenchLifts.push(element.benchKg[index]);
            }
          }
          text = document.createTextNode(
            Math.max(...successfulBenchLifts) != -Infinity ? Math.max(...successfulBenchLifts) : 0
          );
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Deadlift":
          cell = row.insertCell();
          successfulDeadliftLifts = [];
          for (let index = 0; index < element.deadliftStatus.length; index++) {
            const squatStatus = element.deadliftStatus[index];
            if (squatStatus == 1) {
              successfulDeadliftLifts.push(element.deadliftKg[index]);
            }
          }
          text = document.createTextNode(
            Math.max(...successfulDeadliftLifts) != -Infinity ? Math.max(...successfulDeadliftLifts) : 0
          );
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Total":
          cell = row.insertCell();
          let successfulSquatLiftsTotal = successfulSquatLifts.length > 0 ? Math.max(...successfulSquatLifts) : 0;
          let successfulBenchLiftsTotal = successfulBenchLifts.length > 0 ? Math.max(...successfulBenchLifts) : 0;
          let successfulDeadliftLiftsTotal =
            successfulDeadliftLifts.length > 0 ? Math.max(...successfulDeadliftLifts) : 0;
          let combinedLiftsTotal =
            0 + successfulSquatLiftsTotal + successfulBenchLiftsTotal + successfulDeadliftLiftsTotal;
          if (inKgs) {
            text = document.createTextNode(`${combinedLiftsTotal} kgs | ${kgToLbs(combinedLiftsTotal)} lbs`);
          } else {
            text = document.createTextNode(`${kgToLbs(combinedLiftsTotal)} lbs | ${combinedLiftsTotal} kgs`);
          }
          cell.className = header;
          cell.appendChild(text);
          break;
        case "Points":
          cell = row.insertCell();
          text = document.createTextNode(element.points || 0);
          cell.className = header;
          cell.appendChild(text);
          break;
      }
    }
  }
}

function generateTitle(sex, weightClass = null) {
  if (entriesGrouping === "class") {
    document.getElementById("leaderboardDescription").innerHTML = `Sex: ${sex} | Class: ${weightClass}`;
  } else if (entriesGrouping === "points") {
    document.getElementById("leaderboardDescription").innerHTML = `${sex} by points`;
  }
}

async function handleTableLoop(table, data) {
  if (entriesGrouping === "class") {
    for (const key in data) {
      for (const index in data[key]) {
        var sortedEntries = data[key][index]["entries"]
          .sort(function (a, b) {
            return a.points - b.points;
          })
          .reverse();
        const perChunk = entriesPerTable;
        const chunkedData = sortedEntries.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / perChunk);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        }, []);
        for (let chunk = 0; chunk < chunkedData.length; chunk++) {
          const element = chunkedData[chunk];
          table.innerHTML = "";
          table.createTBody();
          generateTableHead(table, tableHeaders);
          generateTitle(key, data[key][index].weightClass);
          generateRows(table, data[key][index].weightClass, element, chunk);
          await sleep(rotationTimeSeconds * 1000);
        }
      }
    }
    generateTable();
  } else if (entriesGrouping === "points") {
    for (const key in data) {
      var sortedEntries = data[key]
        .sort(function (a, b) {
          return a.points - b.points;
        })
        .reverse();
      const perChunk = entriesPerTable;
      const chunkedData = sortedEntries.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);
      for (let chunk = 0; chunk < chunkedData.length; chunk++) {
        const element = chunkedData[chunk];
        table.innerHTML = "";
        table.createTBody();
        generateTableHead(table, tableHeaders);
        generateTitle(key);
        generateRows(table, null, element, chunk);
        await sleep(rotationTimeSeconds * 1000);
      }
    }
    generateTable();
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
  const response = await fetch(apiUrl + "/lifter/results?entries_filter=" + entriesGrouping, {
    method: "GET",
    headers: fetchHeaders,
  });
  const data = JSON.parse(await response.json());
  inKgs = data.inKg;
  delete data["inKg"];
  handleTableLoop(table, data);
}
