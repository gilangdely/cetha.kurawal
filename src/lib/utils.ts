import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function sanitizeValue(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (Array.isArray(value)) {
    return value.map((item) => {
      const sanitized = sanitizeValue(item);
      return sanitized === undefined ? null : sanitized;
    });
  }

  if (value instanceof Date) return value;

  if (typeof value === "object") {
    const output: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>,
    )) {
      const sanitized = sanitizeValue(nested);
      if (sanitized !== undefined) {
        output[key] = sanitized;
      }
    }

    return output;
  }

  return value;
}

export function sanitizeForFirestore<T>(value: T): T {
  const sanitized = sanitizeValue(value);
  return (sanitized === undefined ? null : sanitized) as T;
}
