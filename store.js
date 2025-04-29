import { writable } from "svelte/store"

export const countStore = writable(0);
export const savedCountsStore = writable([]);
export const lastSavedCountStore = writable(null);
export const doubleClickStore = writable(false);
//color theme
export const themeColor = writable('#007bff');
//list of cards
export const cards = writable([]);
export const revealedCards = writable([]); // Whether each card has been revealed (true/false for each card)
export const sum = writable(0); // Sum of revealed card values
export const message = writable(''); // Message to the player ("You win!", "Bust!", etc.)
//tab system: list of tabs and current active tab store
// Tab system: list of tabs and current active tab store
export const tabs = ['Home', 'Profile', 'Settings'];
export const activeTab = writable(tabs[0]);

// Function to set the active tab
export function setActiveTab(tab) {
  if (tabs.includes(tab)) {
    activeTab.set(tab);
  } else {
    console.warn(`Invalid tab: "${tab}"`);
  }
}
