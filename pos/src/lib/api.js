/**
 * Thin wrapper around the preload bridge (`window.posApi`).
 * Unwraps the `{ ok, data | error }` envelope returned by the main process
 * and turns failures into regular Error objects.
 */

export class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export function isBridgeAvailable() {
  return typeof window !== 'undefined' && typeof window.posApi === 'object' && window.posApi !== null;
}

function bridge() {
  if (!isBridgeAvailable()) {
    throw new ApiError('BRIDGE_UNAVAILABLE', 'Desktop bridge is not available. Run the app through Electron.');
  }
  return window.posApi;
}

async function unwrap(promise) {
  const response = await promise;
  if (!response || typeof response !== 'object') {
    throw new ApiError('INVALID_RESPONSE', 'Received an invalid response from the application.');
  }
  if (!response.ok) {
    throw new ApiError(response.error?.code ?? 'UNKNOWN', response.error?.message ?? 'Request failed.');
  }
  return response.data;
}

export const api = {
  app: {
    getInfo: () => unwrap(bridge().app.getInfo()),
  },
  system: {
    getHealth: () => unwrap(bridge().system.getHealth()),
  },
  categories: {
    list: () => unwrap(bridge().categories.list()),
    get: (id) => unwrap(bridge().categories.get(id)),
    create: (data) => unwrap(bridge().categories.create(data)),
    update: (id, data) => unwrap(bridge().categories.update(id, data)),
    delete: (id) => unwrap(bridge().categories.delete(id)),
  },
  products: {
    list: (options) => unwrap(bridge().products.list(options)),
    get: (id) => unwrap(bridge().products.get(id)),
    getByBarcode: (barcode) => unwrap(bridge().products.getByBarcode(barcode)),
    create: (data) => unwrap(bridge().products.create(data)),
    update: (id, data) => unwrap(bridge().products.update(id, data)),
    delete: (id) => unwrap(bridge().products.delete(id)),
    getLowStock: () => unwrap(bridge().products.getLowStock()),
  },
};
