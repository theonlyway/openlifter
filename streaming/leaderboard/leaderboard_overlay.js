var tableHeaders = ["Place", "Lifter", "Class", "Body Weight", "Age", "Squat", "Bench", "Deadlift", "Total", "Points"];
var sampleData = [
  {
    Place: 1,
    Lifter: "Frodo Moody",
    Class: "43.5",
    "Body Weight": "32.8",
    Age: "23",
    Squat: "355",
    Bench: "262.5",
    Deadlift: "267.5",
    Total: "885kg / 1951.1lb",
    Points: "1440.49",
  },
];

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
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function generateTable() {
  document.getElementById("leaderboardDescription").innerHTML = "Sex | Class | Division | Event";
  var table = document.getElementById("leaderboardTable");
  generateTableHead(table, tableHeaders);
  generateRows(table, sampleData);
}
