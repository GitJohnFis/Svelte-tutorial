import { writable } from 'svelte/store';

//settings app
	export const countStep = writable(1);
	export const themeColor = writable('#007bff');
// New Setting for enabling/disabling double count
export const doubleClickEnabled = writable(false);

export function resetSettings() {
countStep.set(1);
themeColor.set('#007bff')
doubleClickEnabled.set(false);
}
