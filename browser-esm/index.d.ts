import { Observable } from 'rxjs';

/**
 * Determines what caused an error to be thrown.
 *
 * @public
 */
export declare enum ErrorType {
    /**
     * Specifies an error which is thrown when
     * events were not executed in the expected order,
     * e.g. trying to mute a device without having the call lock.
     *
     * These are usually fixable errors and happen due to control flow.
     */
    SDK_USAGE_ERROR = "sdk-usage-error",
    /**
     * Specifies an error which is thrown when
     * the specified command/feature is not supported by the device,
     * e.g. trying to mute a device that does not have a microphone.
     */
    FEATURE_NOT_SUPPORTED = "feature-not-supported",
    /**
     * Specifies an error which is thrown when
     * communicating with a Jabra device.
     *
     * This can happen due to several reasons,
     * e.g. device disconnected during packet transmission.
     *
     * Depending on the reason, this could either mean
     * that the operation is fatal or that it might work
     * if attempted again.
     */
    DEVICE_ERROR = "device-error",
    /**
     * Specifies an error which is thrown and
     * doesn’t fall in any of the other categories.
     */
    UNEXPECTED_ERROR = "unexpected-error",
    /**
     * Specifies an error which is thrown due
     * to incorrect initialization.
     *
     * The user either has not installed the necessary components
     * (e.g. Chrome extension, console application),
     * or they have not provided correct arguments when
     * initializing the Jabra SDK
     * (e.g. missing/incomplete softphone information)
     */
    INIT_ERROR = "init-error"
}

/**
 * Main Jabra API object.
 * Returned after SDK initialization (see {@link init}).
 *
 * Provides an entry point to reflecting and changing the state of Jabra devices.
 *
 * @example
 * Here is an example where the JabraApi object can be used
 * to subscribe to events related to jabra devices. The example
 * iterates through all connected devices and prints them in the console:
 * ```ts
 * const yourSoftphoneInfo; // See the init function for more details
 *
 * // Init the Jabra SDK
 * const jabraApi = await jabrav3.init(yourSoftphoneInfo);
 *
 * // Subscribe to changes to the connected Jabra devices
 * jabraApi.deviceList.subscribe((devices) => {
 *   devices.forEach(async (device) => {
 *     console.log(`- ${device.name}`);
 *   });
 * });
 * ```
 * @public
 */
export declare interface IApi {
    /**
   * A list of connected physical Jabra devices.
   * Each device object can be consumed by the third party developer.
   * See {@link IDevice} for more information.
   */
    deviceList: Observable<IDevice[]>;
    /**
     * Returns the Jabra SDK version
     */
    getVersion(): string;
    /**
     * Get the Jabra Chromehost version
     *
     * Chromehost is the native console application communicating with the USB-layer.
     *
     * In node context, the Chromehost will be embedded in the jabra-js stack, and not something to be concerned with as an SDK-user.
     *
     * In browser context, the Chromehost is a required application that needs to be installed separately from this
     * npm-package - unless the library is configured to use WebHID-transport, see {@link IConfig.transport}.
     *
     * @returns The version number or null if not installed.
     */
    getChromehostVersion(): Promise<string | null>;
    /**
     * Get the Jabra Chrome Extension version
     *
     * In node context, the Chrome Extension is unnecessary and will always return null.
     *
     * In browser context, the Chrome Extension is a required component that needs to be installed separately from this
     * npm-package - unless the library is configured to use WebHID-transport, see {@link IConfig.transport}.
     *
     * @returns The version number or null if not installed.
     */
    getChromeExtensionVersion(): Promise<string | null>;
    /**
     * Get the underlying transport context.
     * Especially relevant when running in the browser to distinguish between
     * WebHID and Chrome Extension/Host
     * See enum {@link TransportContext}
     */
    transportContext: TransportContext;
}

/**
 * Optional configuration used when initializing the Jabra SDK.
 *
 * @remarks
 * In particular, the `IJabraConfig` object allows you to overwrite the
 * default message/warning/error logger with your own custom implementation.
 *
 * @public
 */
export declare interface IConfig {
    /**
     * Implementation of the {@link ILogger} interface, used for logging runtime messages.
     * Can be a custom implementation depending on the user's needs.
     *
     * @remarks
     *
     * By default, the Jabra SDK logs messages as it executes its usual operations.
     * These log events can be intercepted by implementing the {@link ILogger} interface,
     * and providing your own custom functionality.
     *
     * For example, the following code snippet defines an
     * implementation that logs the message (and nothing else) directly to the console:
     *
     * ```ts
     * class CustomConsoleLog implements ILogger {
     *   write(event: ILogEvent) {
     *     console.log(event.message);
     *   }
     * }
     *
     * const softphoneInfo = ..;
     * const logger = new CustomConsoleLog();
     * const config = { logger: logger }
     * jabrav3.init(softphoneInfo, config);
     * ```
     */
    logger?: ILogger;
    /**
     * If set, this enables the SDK user to explicitly choose which transport
     * mechanism they would like to use.
     *
     * The options are to use the Chrome extension (default behaviour), Chrome extension but falling back
     * to WebHID if the extension is not available, or just WebHID.
     *
     * Currently the WebHID-standard is only available in Chromium based browsers and requires active
     * consent from the end-user.
     *
     * @remarks
     *
     * To collect user consent, import the webHidPairing function from main package and fire when end-user clicks
     * a relevant button in the UI (must be triggered by a user interaction - otherwise the request will be blocked).
     * The browser will show a list of connected Jabra devices and the user can choose what device to pair with.
     *
     * The browser caches consents for devices when paired - so this is only needed once per device.
     *
     * ```ts
     * import { webHidPairing } from '@gnaudio/jabra-js';
     *
     * document.getElementById('consent-button').addEventListener('click', async () => {
     *   await webHidPairing();
     * });
     *
     * // Init library as normal
     *```
     */
    transport?: RequestedBrowserTransport;
    /* Excluded from this release type: internal */
}

/**
 * Main entry point for reflecting and changing the state
 * of a physical Jabra device that is connected to the computer.
 *
 * @public
 */
export declare interface IDevice {
    /**
     * Retrieves the ID of the device.
     *
     * @returns The device's ID.
     */
    readonly id: string;
    /**
     * Retrieves the name of the device.
     *
     * @returns The device's name.
     */
    readonly name: string;
    /**
     * The vendor ID of the device.
     * Should be the Jabra vendor ID, i.e. 2830.
     *
     * @returns The devices' vendor ID, i.e. Jabra.
     */
    readonly vendorId: number;
    /**
     * The product ID of the device,
     * e.g. 3648 for Jabra Evolve2 40.
     *
     * @returns The devices' product ID.
     */
    readonly productId: number;
    /**
     * Retrieves the full access label of
     * the device. This is a stringified
     * version of {@link IDevice.vendorId} and {@link IDevice.productId}.
     *
     * @returns The label of the device,
     * e.g. '0b0e:0e40' for Jabra Evolve2 40.
     */
    readonly browserLabel: string;
    /**
     * Observable for signals emitted by the device.
     *
     * Whenever the device sends a new signal,
     * this observable will be populated with {@link IDeviceSignal}
     * instances for each emission.
     *
     * @remarks
     * Reacting to incoming signals is an advanced topic.
     * Before implementing your solution, we urge you to check out the
     * {@link https://sdk3jsprerelease.z6.web.core.windows.net/docs/build/docs/tutorials/call-control-tutorial#reacting-to-device-signals
     * | guide on device signals}.
     *
     * @returns An observable that emits signals.
     */
    readonly deviceSignals: Observable<IDeviceSignal>;
    /**
     * Tries to acquire a call lock.
     * The call lock is a unique, per-device lock,
     * and is required in order to change the state of the device.
     *
     * Acquiring the call lock should always be the first step
     * in performing call control operations.
     *
     * @remarks
     * Acquiring a call lock can fail. This can happen due to multiple reasons:
     * - The device is call locked by another softphone that is using the Jabra SDK.
     *   This will result in `false` being returned.
     * - The device is call locked by another instance of your softphone implementation.
     *   This will result in `false` being returned
     * - You've already call locked the device (and therefore can proceed with any other functionality that requires the call lock).
     *   This will result in an Exception being thrown.
     *
     * @returns A Promise that resolves with `true` if the call lock is successfully acquired, `false` otherwise.
     *
     * @throws If you have already call locked the device.
     */
    takeCallLock(): Promise<boolean>;
    /**
     * Releases a previously acquired call lock.
     *
     * Releasing the call lock is the last step in
     * performing call control operations so remember
     * to execute it once you are done with the Jabra device.
     *
     * @throws If there is no active call lock imposed on the device by your softphone.
     */
    releaseCallLock(): void;
    /**
     * Informs the Jabra device that there's a change in the call status.
     *
     * @param isOffHook - The new offHook status of the device.
     * Use `true` when a call becomes active, regardless of call type (outgoing or incoming).
     * Use `false` when a call has ended and the device is no longer used.
     */
    offHook(isOffHook: boolean): void;
    /**
     * Starts or ends the "ring" effect on the Jabra device.
     * Used to indicate an incoming call.
     *
     * @param shouldRing - `true` to start the "ring" effect, `false` to stop it.
     *
     * @throws If a call lock was not acquired prior to execution. See {@link IDevice.takeCallLock} for more details.
     */
    ring(shouldRing: boolean): void;
    /**
     * Mutes or unmutes the microphone of the Jabra device.
     *
     * @remarks
     * Should only be used during a call.
     *
     * @param shouldMute - `true` to mute the device, `false` to unmute it.
     *
     * @throws If a call lock was not acquired prior to execution. See {@link IDevice.takeCallLock} for more details.
     */
    mute(shouldMute: boolean): void;
    /**
     * Tells the device whether an active call was put on hold
     * or a held up call was resumed.
     *
     * @param shouldHold - `true` when a call gets put on hold, `false` when it is resumed.
     *
     * @throws If a call lock was not acquired prior to execution. See {@link IDevice.takeCallLock} for more details.
     */
    hold(shouldHold: boolean): void;
}

/**
 * Represent a signal that is emitted from a Jabra device.
 * These signals notify you that something has happened on the device.
 *
 * This could be:
 *
 * - the user expressing an intent to do something by interacting with the device (e.g. pressing a button).
 *
 * - acknowledgement to a request (e.g. a {@link SignalType | SignalType.HOOK_SWITCH} signal after your softphone starts a call successfully).
 *
 * - an error condition (e.g. headset out of range from the base station).
 *
 * @remarks
 * Reacting to incoming signals is an advanced topic.
 * Before implementing your solution, we urge you to check out the
 * {@link https://sdk3jsprerelease.z6.web.core.windows.net/docs/build/docs/tutorials/call-control-tutorial#reacting-to-device-signals
 * | guide on device signals}.
 *
 * @public
 */
export declare interface IDeviceSignal {
    /**
     * The type of signal that was emitted by the device.
     */
    type: SignalType;
    /**
     * The signal's reported value.
     */
    value: boolean;
    /**
     * Describes the type of value for this signal. Can either be "relative" or "absolute".
     *
     * @remarks
     * Absolute:
     * Value will either be `0` or `1`.
     * `0` means `OFF` and `1` means `ON`.
     *
     * Relative:
     * Value will always be `1`.
     * For relative values the signal should be treated as a "toggle"
     * meaning the new state related to that signal is opposite
     * of the previous state (e.g. from `muted` to `unmuted`, from `unmuted` to `muted`).
     */
    valueType: ValueType;
    /**
     * Stringified version of the `IDeviceSignal` instance.
     */
    toString(): string;
}

/**
 * Describes an error that can be thrown while
 * utilizing the Jabra SDK.
 *
 * It has the usual properties of an `Error`,
 * with some additional ones added.
 *
 * @public
 */
export declare interface IJabraError extends Error {
    /**
     * Error reason, e.g. unsupported feature.
     */
    readonly type: ErrorType;
}

/**
 * Describes all necessary information about a log event.
 *
 * @public
 */
export declare interface ILogEvent {
    /**
     * The severity of the log event, e.g. error or warning. See {@link LogLevel}.
     */
    level: LogLevel;
    /**
     * The stack layer where the log event occured, e.g. inside the Chrome extension.
     * See {@link StackLayer}.
     */
    layer: StackLayer;
    /**
     * Text message that will be logged.
     */
    message: string;
}

/**
 * Interface used to describe an object that can log runtime information.
 *
 * @public
 */
export declare interface ILogger {
    /**
     * Logs a message based on an event that triggered during runtime operations.
     *
     * @param event - Event that should be logged. Includes message, logging level and message.
     * See {@link ILogEvent} for more information.
     */
    write(event: ILogEvent): void;
}

/**
 * Initialize the Jabra SDK.
 * Entry point to being able to control Jabra hardware.
 *
 * @example
 * Here is a small example that initializes the Jabra SDK:
 * ```ts
 * // Import the Jabra SDK
 * import * as jabraSdk from '../../esm/index.js';
 *
 * // Make sure to provide a unique name and UUID
 * const softphoneIfo = { name: 'my-third-party-phone-app', uuid: '3b9d6acb-6435-4e75-abd2-7b77c28fa3b0' };
 *
 * // Initialize the SDK
 * const jabraApi = await jabraSdk.init(softphoneInfo);
 * ```
 *
 * @param softphoneInfo - Softphone information used for Jabra Direct. See {@link ISoftphoneInfo} for more details.
 * @param config - Optional configuration settings. See {@link IConfig} for more details.
 *
 * @returns The initialized SDK object, which can be used to control Jabra hardware.
 *
 * @throws If the underlying transport object (console-app or Chrome extension)
 * fails to connect for some reason, e.g. when it's not installed on the system.
 *
 * @public
 */
export declare function init(softphoneInfo: ISoftphoneInfo, config?: IConfig | null): Promise<IApi>;

/* Excluded from this release type: IRecorder */

/**
 * Softphone information used for Jabra Direct integration
 *
 * @public
 */
export declare interface ISoftphoneInfo {
    /**
     * Name of the softphone. This will be shown in Jabra Direct
     * if installed.
     */
    name: string;
    /**
     * An UUID. Ie: 'cd6f5256-a266-4176-8ee9-2312c4a9754a'. A unique identifer for the softphone.
     * It should not be shared with other softphone integrations.
     */
    uuid: string;
}

/* Excluded from this release type: ITransport */

/**
 * Error severity of a log, i.e. whether a log event is due
 * to an exception, warning, or just a info message.
 * See {@link ILogEvent}.
 *
 * @public
 */
export declare enum LogLevel {
    /**
     * Used when the reason for the log event can be regarded as an error.
     */
    ERROR = "error",
    /**
     * Used when the user is warned that something might have gone wrong (but not necessarily).
     */
    WARNING = "warning",
    /**
     * Used to log messages related to normal execution.
     */
    INFO = "info"
}

/**
 * Optional transport modes that can be requested on initialisation. These are relevant when
 * operating within a browser context only. They are not used outside of a browser, where Node
 * is used instead.
 *
 * @public
 */
export declare enum RequestedBrowserTransport {
    CHROME_EXTENSION = "chrome-extension",
    WEB_HID = "web-hid",
    CHROME_EXTENSION_WITH_WEB_HID_FALLBACK = "chrome-extension-with-web-hid-fallback"
}

/**
 * Definitions for incoming signals from Jabra devices.
 *
 * @remarks
 * This list might not be exhaustive.
 *
 * @public
 */
export declare enum SignalType {
    /**
     * The signal is reported in multiple scenarios:
     *
     * - as an acknowledgement of a successful IDevice.offHook(true) request made by your softphone,
     *
     * - when the user is trying to accept an incoming call by interacting with the device, or
     *
     * - when the user is trying to start a new outgoing call by interacting with the device.
     *
     * For further information, refer to the
     * {@link https://jabrajsdemo.z6.web.core.windows.net/docs/build/docs/tutorials/call-control-tutorial#reacting-to-hook_switch
     * | guide on device signals}.
     */
    HOOK_SWITCH = 32,
    /**
     * This signal is reported in multiple scenarios:
     *
     * - when the user requests to hold a call by interacting with the device,
     *
     * - when the user requests to resume a call by interacting with the device, or
     *
     * - when the user requests to swap the 'active' call (if there's multiple calls running on their system).
     */
    FLASH = 33,
    ALT_HOLD = 35,
    REDIAL = 36,
    ONLINE = 42,
    SPEAKER_PHONE = 43,
    /**
     * Indicates a change in the mute state of the microphone.
     *
     * For further information, refer to the
     * {@link https://jabrajsdemo.z6.web.core.windows.net/docs/build/docs/tutorials/call-control-tutorial#expected-signals-must-trigger-a-reaction
     * | guide on device signals}.
     */
    PHONE_MUTE = 47,
    SEND = 49,
    SPEED_DIAL = 80,
    VOICE_MAIL = 112,
    ANSWER_ON_OFF = 116,
    LINE_BUSY = 151,
    RINGER = 158,
    PHONE_KEY_0 = 176,
    PHONE_KEY_1 = 177,
    PHONE_KEY_2 = 178,
    PHONE_KEY_3 = 179,
    PHONE_KEY_4 = 180,
    PHONE_KEY_5 = 181,
    PHONE_KEY_6 = 182,
    PHONE_KEY_7 = 183,
    PHONE_KEY_8 = 184,
    PHONE_KEY_9 = 185,
    PHONE_KEY_STAR = 186,
    PHONE_KEY_POUND = 187,
    ALT_VOLUME_UP = 233,
    ALT_VOLUME_DOWN = 234,
    REJECT_CALL = 65533
}

/**
 * The stack layer in which the log event occured,
 * i.e. which module caused the {@link ILogEvent}.
 *
 * @privateRemarks **TODO** One for each? win, mac, linux
 *
 * @public
 */
export declare enum StackLayer {
    /**
     * The log event was triggered by the Chrome extension.
     */
    CHROME_EXTENSION = "chrome-extension",
    /**
     * The log event was triggered by the native console app (i.e. the low level USB HID layer).
     */
    NATIVE_CONSOLE = "native-console",
    /**
     * The log event was triggered by the JavaScript SDK.
     */
    JS_LIB = "js-lib"
}

/**
 * Transport context to determine what mechanism is used to communicate with connected devices
 *
 * @public
 */
export declare enum TransportContext {
    NODE = "node",
    CHROME_EXTENSION = "chrome-extension",
    WEB_HID = "web-hid"
}

/**
 * HID usage value type
 *
 * @public
 */
export declare enum ValueType {
    ABSOLUTE = "absolute",
    RELATIVE = "relative"
}

/**
 * Triggers WebHID consent dialogue in compatible browsers
 *
 * Use like this:
 *
 * ```ts
 * import { webHidPairing } from '@gnaudio/jabra-js';
 *
 * document.getElementById('consent-button').addEventListener('click', async () => {
 *   await webHidPairing();
 * });
 *
 * // Init library as normal
 * ```
 *
 * @public
 */
export declare function webHidPairing(): Promise<void>;

export { }
