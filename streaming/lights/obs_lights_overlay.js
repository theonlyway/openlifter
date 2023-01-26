const urlParams = new URLSearchParams(window.location.search);
const refreshTimeSeconds = parseInt(urlParams.get("refresh") || 1);
const platform = parseInt(urlParams.get("platform") || 1);
const authRequired = JSON.parse(urlParams.get("auth") || true);
const apiUrl = urlParams.get("apiurl") || "http://localhost:8080/theonlyway/Openlifter/1.0.0";
const apiKey = urlParams.get("apikey") || "441b6244-8a4f-4e0f-8624-e5c665ecc901";

var timeInSecs;
var ticker;
var fetchHeaders = {};
var lightsData;
var lastLightTimestamp;

const getLightsData = async () => {
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
  const response = await fetch(apiUrl + "/lights/" + platform, {
    method: "GET",
    headers: fetchHeaders,
  });
  const data = await response.json();
  lightsData = data;
  if ("referees" in data) {
    for (const [key, value] of Object.entries(data.referees)) {
      element = document.getElementById(value.name + "Light");
      switch (value.status) {
        case "clear":
          element.classList.remove("goodLift");
          element.classList.remove("badLift");
          break;
      }
    }
  }
  if ("last" in data) {
    if (data.last[0].dts !== lastLightTimestamp)
      for (const [key, value] of Object.entries(data.last[0].referees)) {
        element = document.getElementById(value.name + "Light");
        switch (value.status) {
          case "clear":
            element.classList.remove("goodLift");
            element.classList.remove("badLift");
            break;
          case "good lift":
            element.classList.add("goodLift");
            element.classList.remove("badLift");
            break;
          case "no lift":
            element.classList.remove("goodLift");
            element.classList.add("badLift");
            break;
        }
        lastLightTimestamp = data.last[0].dts;
      }
  }
};

(async () => {
  await getLightsData();
})();

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
    getLightsData();
    console.log("Refreshed");
    timeInSecs = refreshTimeSeconds;
  }
}

startTimer(refreshTimeSeconds);
