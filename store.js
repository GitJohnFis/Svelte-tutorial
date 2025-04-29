import { writable } from "svelte/store"

export const countStore = writable(0);
export const savedCountsStore = writable([]);
export const lastSavedCountStore = writable(null);
export const doubleClickStore = writable(false);
//color theme
export const activeTab = writable('counter');
export const themeColor = writable('#007bff');
//list of cards
export const cards = writable([]);
export const revealedCards = writable([]); // Whether each card has been revealed (true/false for each card)
export const sum = writable(0); // Sum of revealed card values
export const message = writable(''); // Message to the player ("You win!", "Bust!", etc.)
