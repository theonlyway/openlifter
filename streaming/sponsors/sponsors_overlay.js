const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 5);
const imageWidth = urlParams.get("image_width") || "350";
const imageHeight = urlParams.get("image_height") || "200";
const sponsorImages = [
  {
    image: "dental_members.png",
    imageWidth: "290",
    imageHeight: "180",
    backgroundColour: "white",
  },
  {
    image: "electro_systems_no_good.png",
    imageWidth: "290",
    imageHeight: "180",
  },
  {
    image: "ideal_nutrition.png",
    imageWidth: "290",
  },
  {
    image: "myo_new.png",
    imageWidth: "290",
    imageHeight: "190",
  },
  {
    image: "wayv.png",
    imageWidth: "290",
    imageHeight: "190",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateStyles() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  let sheet = document.styleSheets[0];
  sheet.insertRule(
    `.container {  visibility: visible;  opacity: 1;  margin: 1px;  position: absolute;  overflow: hidden; width: ${
      imageWidth * 0.1
    } }`,
    0
  );
  for (const index in sponsorImages) {
    let height = sponsorImages[index]["imageHeight"] ? sponsorImages[index]["imageHeight"] : imageHeight;
    let width = sponsorImages[index]["imageWidth"] ? sponsorImages[index]["imageWidth"] : imageWidth;
    let className = sponsorImages[index]["image"].split(".")[0];
    let rule = sponsorImages[index]["backgroundColour"]
      ? `.${className} { height: auto; width: auto; max-width: ${width}px; max-height: ${height}px; overflow: auto; background-color: ${sponsorImages[index]["backgroundColour"]}; }`
      : `.${className} { height: auto; width: auto; max-width: ${width}px; max-height: ${height}px; overflow: auto; background-color: transparent; }`;
    sheet.insertRule(rule, 0);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function rotateSponsors() {
  generateStyles();
  while (true) {
    for (const index in sponsorImages) {
      let element = document.getElementById("rotateImage");
      element.className = "";
      element.classList.add(sponsorImages[index]["image"].split(".")[0]);
      element.src = "images/" + sponsorImages[index]["image"];
      await sleep(rotationTimeSeconds * 1000);
    }
  }
}
