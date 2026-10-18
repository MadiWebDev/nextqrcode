/**
 * Cached Mongoose connection for serverless runtimes.
 *
 * The connection (and its in-flight promise) is cached on `globalThis` so it
 * survives hot reloads in dev and is reused across invocations on the same
 * serverless instance in production. Nothing here throws at import time —
 * missing configuration surfaces only when `dbConnect()` is called.
 */
import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};
globalThis.__mongooseCache = cache;

/** True when a MongoDB connection string is available. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/**
 * Return the shared Mongoose connection, creating it on first use.
 * @throws {Error} when MONGODB_URI is not configured.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGODB_URI is not set. Configure a MongoDB connection string to use the database.'
      );
    }
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
