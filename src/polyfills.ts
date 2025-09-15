// Polyfills for browser compatibility
declare global {
  var global: any;
  var process: any;
  var Buffer: any;
}

if (typeof global === 'undefined') {
  (window as any).global = window;
}

if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

// Buffer polyfill for sockjs-client
if (typeof Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: () => false,
    alloc: () => new Uint8Array(),
    from: () => new Uint8Array(),
  };
}

export {};
