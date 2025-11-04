export function getChangedFields<T extends Record<string, any>>(
  updates: Partial<T>,
  original: T,
  formFields: (keyof T)[]
): boolean {
  const deepEqual = (a: unknown, b: unknown): boolean => {
    // Strict equality covers primitives and same reference
    if (a === b) return true;

    // Handle Dates
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, i) => deepEqual(item, b[i]));
    }

    // Handle plain objects
    if (
      typeof a === "object" &&
      a !== null &&
      typeof b === "object" &&
      b !== null
    ) {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;

      return aKeys.every((key) =>
        deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
      );
    }

    // Fallback — not equal
    return false;
  };

  const isChanged = formFields.some((field) => {
    const updatedValue = updates[field];
    const originalValue = original[field];
    const changed = !deepEqual(updatedValue, originalValue);

    // console.log(
    //   String(field),
    //   updatedValue,
    //   originalValue,
    //   changed,
    //   "(final compare)"
    // );

    return changed;
  });

  return isChanged;
}
