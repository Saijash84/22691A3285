import type { LogLevel, LogStack } from './types';

const url = 'http://28.244.56.144/evaluation-service/log';

export async function Log(stack: LogStack, level: LogLevel, pkg: string, message: string) {
  const body = JSON.stringify({ stack, level, package: pkg, message });
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
  } catch {}
} 