import db from "./db";

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 15;

export async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; message?: string }> {
  const record = await db.rateLimit.findUnique({
    where: { ip },
  });

  if (!record) {
    return { allowed: true };
  }

  if (record.lockUntil && new Date() < record.lockUntil) {
    const minutesLeft = Math.ceil(
      (record.lockUntil.getTime() - new Date().getTime()) / 60000,
    );
    return {
      allowed: false,
      message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${minutesLeft} menit.`,
    };
  }

  if (record.lockUntil && new Date() > record.lockUntil) {
    await db.rateLimit.update({
      where: { ip },
      data: { attempts: 0, lockUntil: null },
    });
    return { allowed: true };
  }

  return { allowed: true };
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  const record = await db.rateLimit.findUnique({
    where: { ip },
  });

  if (!record) {
    await db.rateLimit.create({
      data: { ip, attempts: 1 },
    });
    return;
  }

  const newAttempts = record.attempts + 1;
  const lockUntil =
    newAttempts >= MAX_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60000)
      : null;

  await db.rateLimit.update({
    where: { ip },
    data: {
      attempts: newAttempts,
      lockUntil,
    },
  });
}

export async function resetAttempts(ip: string): Promise<void> {
  const record = await db.rateLimit.findUnique({
    where: { ip },
  });

  if (record) {
    await db.rateLimit.update({
      where: { ip },
      data: { attempts: 0, lockUntil: null },
    });
  }
}

import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          return reject(new Error("Rate limit exceeded"));
        }

        return resolve();
      }),
  };
}
