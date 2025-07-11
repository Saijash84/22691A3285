type LogLevel = 'info' | 'error' | 'fatal' | 'debug' | 'warn';
type LogStack = 'frontend' | 'backend';

interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: string;
  message: string;
}

const LOG_ENDPOINT = 'https://affordmed-test-server.com/log'; // Replace with actual endpoint

export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: string,
  message: string
): Promise<void> {
  const payload: LogPayload = { stack, level, package: pkg, message };

  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (typeof window === 'undefined') {
      // Node.js fallback
      // eslint-disable-next-line no-console
      console.error('Log failed:', err);
    }
  }
} 