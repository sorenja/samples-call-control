function log(message) {
  let logElement = document.createElement("div");
  logElement.innerText = message;
  document.getElementById("log").appendChild(logElement);
}

export { log };
