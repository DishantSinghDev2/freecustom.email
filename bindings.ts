// This ensures the types are picked up by the TypeScript compiler
/// <reference types="@cloudflare/workers-types" />

// Use declaration merging to add your D1 binding to the global CloudflareEnv interface
declare global {
    interface CloudflareEnv {
      DB: D1Database;
    }
  }
  
  // This export is required to make the file a module
  export {};