import { writable } from "svelte/store"

export const countStore = writable(0);
export const savedCountsStore = writable([]);
export const lastSavedCountStore = writable(null);
export const doubleClickStore = writable(false);
