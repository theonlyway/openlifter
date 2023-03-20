const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 15);
const imageWidth = urlParams.get("image_width") || "350";
const imageHeight = urlParams.get("image_height") || "200";
const sponsorImages = [
  "dental_members.jpg",
  "electro_systems.jpg",
  "ideal_nutrition.png",
  "myo_release.png",
  "wayv.png",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function rotateSponsors() {
  while (true) {
    for (const index in sponsorImages) {
      let element = document.getElementById("rotateImage");
      element.src = "images/" + sponsorImages[index];
      element.height = imageHeight;
      element.width = imageWidth;
      await sleep(rotationTimeSeconds * 1000);
    }
  }
}
