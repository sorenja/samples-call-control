import { init } from "../browser-esm";
import { callControl } from "./call-control";
import { log } from "./log";

/// Old sample:
async function sample() {
  try {
    log("Initialising..");
    const api = await init({
      name: "device-list",
      uuid: "3b9d6acb-6435-4e75-abd2-7b77c28fa3b0"
    });

    log("Waiting for device to be attached.");

    api.deviceList.subscribe((devices) => {
      if (devices.length === 1) {
        callControl(devices[0]);
      }
    });
  } catch (err) {
    log(err.message);
  }
}

// Workaround for missing onload event in CodeSandbox
setTimeout(() => {
  sample();
}, 3000);
