import { ipcMain } from 'electron';

/**
 * Error type whose message is safe to show in the renderer.
 * Any other error is logged in the main process and replaced with a
 * generic message so internal details never leak to the UI.
 */
export class IpcError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'IpcError';
    this.code = code;
  }
}

/**
 * Registers an ipcMain.handle() handler with sender verification and a
 * consistent `{ ok, data } | { ok, error }` response envelope.
 *
 * @param {string} channel
 * @param {(...args: unknown[]) => unknown} handler  Receives validated args only (no event object).
 * @param {{ isTrustedSender: (frame: Electron.WebFrameMain | null) => boolean, validate?: (args: unknown[]) => unknown[] }} options
 */
export function registerHandler(channel, handler, { isTrustedSender, validate }) {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, async (event, ...args) => {
    if (!isTrustedSender(event.senderFrame)) {
      console.warn(`[ipc] Rejected "${channel}" from untrusted sender: ${event.senderFrame?.url ?? 'unknown'}`);
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Request rejected.' } };
    }

    try {
      const input = validate ? validate(args) : args;
      const data = await handler(...input);
      return { ok: true, data };
    } catch (error) {
      if (error instanceof IpcError) {
        return { ok: false, error: { code: error.code, message: error.message } };
      }
      if (error?.isUserSafe || error?.name === 'ValidationError') {
        return { ok: false, error: { code: error.code || 'VALIDATION_ERROR', message: error.message } };
      }
      console.error(`[ipc] Handler "${channel}" failed:`, error);
      return { ok: false, error: { code: 'INTERNAL_ERROR', message: error?.message || 'An unexpected error occurred.' } };
    }
  });
}

/** Validator for channels that accept no arguments. */
export function noArgs(args) {
  if (args.length !== 0) {
    throw new IpcError('INVALID_INPUT', 'This operation does not accept arguments.');
  }
  return args;
}
