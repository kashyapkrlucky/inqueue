import type { StoreApi } from "zustand";
import CustomToast from "@/shared/components/ui/CustomToast";

interface RunAsyncActionOptions<T> {
  set: StoreApi<T>["setState"];
  errorMessage: string;
  loadingKey?: keyof T;
  errorKey?: keyof T;
  toast?: boolean;
}

/**
 * Runs a store action with the loading/error/toast bookkeeping every
 * Zustand action in this app repeats by hand: flips `loadingKey` on while
 * `fn` runs, clears `errorKey` beforehand so a stale error can't get stuck
 * on screen, and on failure records the error and/or toasts it.
 */
export async function runAsyncAction<T, R>(
  { set, errorMessage, loadingKey, errorKey, toast = true }: RunAsyncActionOptions<T>,
  fn: () => Promise<R>,
): Promise<R | undefined> {
  try {
    if (loadingKey) set({ [loadingKey]: true } as unknown as Partial<T>);
    if (errorKey) set({ [errorKey]: null } as unknown as Partial<T>);

    return await fn();
  } catch (error) {
    if (errorKey) {
      const message = error instanceof Error ? error.message : errorMessage;
      set({ [errorKey]: message } as unknown as Partial<T>);
    }
    if (toast) {
      CustomToast("error", errorMessage);
    }
    return undefined;
  } finally {
    if (loadingKey) set({ [loadingKey]: false } as unknown as Partial<T>);
  }
}
