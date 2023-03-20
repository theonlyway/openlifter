const urlParams = new URLSearchParams(window.location.search);
const rotationTimeSeconds = parseInt(urlParams.get("rotation") || 15);
