<script>
// export let themeColor; // passed in-theme color
import { themeColor, activeTab } from './store'
	import { get } from 'svelte/store'
// function to darken a hex
function darken(hex) {
	let color = parseInt(hex.slice(1), 16);
	let r = (color >> 16) -30;
	let g = (( color >> 8) & 0x00ff) - 30;
	let b = (color & 0x0000ff) - 30;
	r = Math.max(r, 0);
g =  Math.max(g, 0);
b =  Math.max(b, 0);
const darkenedColor = (r << 16 | g << 8 | b);
return `#${darkenedColor.toString(16).padStart(6, '0')}`;
}

	// Function to update the theme based on the active tab and theme color
	function updateTheme() {
		const tab = get(activeTab);
		const color = get(themeColor);

		const isCounterActive = tab === 'counter';
		const themeColorValue = isCounterActive ? color : '#007bff';
		const themeBackground = isCounterActive ? color : '#ffffff';
		const themeText = isCounterActive ? '#ffffff' : '#000000';
		const themeButtonHover = isCounterActive ? darken(color) : '#0056b3';
	
		// set theme props on the document
	document.documentElement.style.setProperty('--theme-bg', themeBackground);
	document.documentElement.style.setProperty('--theme-text', themeText);
	document.documentElement.style.setProperty('--theme-button', themeColorValue);
	document.documentElement.style.setProperty('--theme-button-hover', themeButtonHover);
	}

// watch for changes to activeTab or themeColor
	$: updateTheme();
</script>
