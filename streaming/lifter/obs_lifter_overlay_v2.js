const urlParams = new URLSearchParams(window.location.search);
const refreshTimeSeconds = parseInt(urlParams.get("refresh") || 1);
const platform = parseInt(urlParams.get("platform") || 1);
const lifterType = urlParams.get("lifter") || "current";
const authRequired = JSON.parse(urlParams.get("auth") || true);
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var timeInSecs;
var ticker;
var fetchHeaders = {};

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
    getCurrentLifter();
    console.log("Refreshed");
    timeInSecs = refreshTimeSeconds;
  }
}

function convertToPounds(kg) {
  return Math.round(kg * 2.2046);
}

function setAttemptColors(data) {
  var currentLiftElement = document.getElementById("lifterAttempt" + data.attempt);
  currentLiftElement.classList.add("currentLift");
  for (let i = 1; i <= 3; ++i) {
    element = document.getElementById("lifterAttempt" + i);
    element.classList.remove("goodLift");
    element.classList.remove("badLift");
    if (i !== data.attempt) {
      element = document.getElementById("lifterAttempt" + i);
      element.classList.remove("currentLift");
      switch (data.platformDetails.lift) {
        case "S":
          if (data.entry.squatStatus[i - 1] === 1) {
            element = document.getElementById("lifterAttempt" + i);
            element.classList.add("goodLift");
          } else {
            if (data.entry.squatKg[i - 1] !== 0) {
              element = document.getElementById("lifterAttempt" + i);
              element.classList.add("badLift");
            }
          }
          break;
        case "D":
          if (data.entry.deadliftStatus[i - 1] === 1) {
            element = document.getElementById("lifterAttempt" + i);
            element.classList.add("goodLift");
          } else {
            if (data.entry.deadliftKg[i - 1] !== 0) {
              element = document.getElementById("lifterAttempt" + i);
              element.classList.add("badLift");
            }
          }
          break;
        case "B":
          if (data.entry.benchStatus[i - 1] === 1) {
            element = document.getElementById("lifterAttempt" + i);
            element.classList.add("goodLift");
          } else {
            if (data.entry.benchKg[i] !== 0) {
              element = document.getElementById("lifterAttempt" + i);
              element.classList.add("badLift");
            }
          }
          break;
      }
    }
  }
}

function getCurrentLifter() {
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
  let i = 1;
  fetch(apiUrl + "/lifter/" + platform + "/" + lifterType, {
    method: "GET",
    headers: fetchHeaders,
  })
    .then((response) => response.json())
    .then((data) => {
      var lift;

      switch (data.platformDetails.lift) {
        case "S":
          lift = "Squat";
          lifterAttemptKgs1 = data.entry.squatKg[0] || "-";
          lifterAttemptKgs2 = data.entry.squatKg[1] || "-";
          lifterAttemptKgs3 = data.entry.squatKg[2] || "-";

          break;
        case "D":
          lift = "Deadlift";
          lifterAttemptKgs1 = data.entry.deadliftKg[0] || "-";
          lifterAttemptKgs2 = data.entry.deadliftKg[1] || "-";
          lifterAttemptKgs3 = data.entry.deadliftKg[2] || "-";
          break;
        case "B":
          lift = "Bench";
          lifterAttemptKgs1 = data.entry.benchKg[0] || "-";
          lifterAttemptKgs2 = data.entry.benchKg[1] || "-";
          lifterAttemptKgs3 = data.entry.benchKg[2] || "-";
          break;
      }

      document.getElementById("lifterName").innerHTML = data.entry.name;
      document.getElementById("lifterClass").innerHTML = data.entry.divisions.join(", ");
      document.getElementById("lifterBodyWeight").innerHTML = data.entry.bodyweightKg;
      document.getElementById("lifterEvent").innerHTML = lift;
      document.getElementById("lifterAttempt1").innerHTML = lifterAttemptKgs1;
      document.getElementById("lifterAttempt2").innerHTML = lifterAttemptKgs2;
      document.getElementById("lifterAttempt3").innerHTML = lifterAttemptKgs3;
      document.getElementById("lifterMaxWeightSquat").innerHTML = "S: " + data.maxLift.maxLifts.squat;
      document.getElementById("lifterMaxWeightBench").innerHTML = "B: " + data.maxLift.maxLifts.bench;
      document.getElementById("lifterMaxWeightDeadlift").innerHTML = "D: " + data.maxLift.maxLifts.deadlift;
      document.getElementById("lifterResultPoints").innerHTML = data.entry.points;
      setAttemptColors(data);
    });
}
getCurrentLifter();
startTimer(refreshTimeSeconds);
