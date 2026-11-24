import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the client across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, create a new promise if not exists
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

let lazyClientPromise: Promise<MongoClient> | null = null;

/**
 * A Promise<MongoClient> that does not call getMongoClient() — and
 * therefore does not open a network connection — until it is first
 * awaited. Used by the Auth.js adapter in src/lib/auth.ts: previously
 * `MongoDBAdapter(getMongoClient())` ran at module-evaluation time, so
 * merely importing the auth module (which happens when the auth route
 * chunk is loaded) started a MongoDB connection. On Cloudflare Workers
 * that is exactly the kind of module-level work the startup-CPU budget
 * (error 10021) penalises. The adapter only awaits the client inside
 * its per-request methods, so deferring the first await defers the
 * connection to the first real auth operation — no behaviour change
 * for sign-in/session flows.
 */
export function getMongoClientLazy(): Promise<MongoClient> {
  if (!lazyClientPromise) {
    const deferred = {
      then(onFulfilled: unknown, onRejected: unknown) {
        return getMongoClient().then(
          onFulfilled as (v: MongoClient) => unknown,
          onRejected as (e: unknown) => unknown
        );
      },
      catch(onRejected: unknown) {
        return getMongoClient().catch(onRejected as (e: unknown) => unknown);
      },
      finally(onFinally: unknown) {
        return getMongoClient().finally(onFinally as () => void);
      },
      [Symbol.toStringTag]: 'Promise',
    };
    lazyClientPromise = deferred as Promise<MongoClient>;
  }
  return lazyClientPromise;
}

export async function getDatabase(dbName = 'qrcode_tools') {
  const client = await getMongoClient();
  return client.db(dbName);
}
