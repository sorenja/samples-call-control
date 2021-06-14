import { log } from "./log";

function callControl(device) {
  log(`Device ready: ${device.name}`);

  document.querySelectorAll("#actions button").forEach((button) => {
    button.onclick = async (event) => {
      try {
        switch (event.currentTarget.id) {
          case "take-call-lock":
            const gotLock = await device.takeCallLock();

            if (gotLock) {
              log("Got the lock");
            } else {
              log("Unable to get the lock");
            }
            break;

          case "release-call-lock":
            await device.releaseCallLock();
            log("Release the lock");
            break;

          case "start-ringer":
            await device.ring(true);
            log("Start ringer");
            break;

          case "stop-ringer":
            await device.ring(false);
            log("Stop ringer");
            break;

          case "start-call":
            await device.offHook(true);
            log("Start call");
            break;

          case "stop-call":
            await device.offHook(false);
            log("Stop call");
            break;

          case "mute":
            await device.mute(true);
            log("Mute");
            break;

          case "unmute":
            await device.mute(false);
            log("Unmute");
            break;

          case "hold-call":
            await device.hold(true);
            log("On hold");
            break;

          case "resume-call":
            await device.hold(false);
            log("Resume call");
            break;

          default:
            return;
        }
      } catch (err) {
        log(err.message);
      }
    };
  });
}

export { callControl };
