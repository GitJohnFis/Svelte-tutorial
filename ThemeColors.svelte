<script>
	import { themeColor, activeTab } from './store';

	// Function to darken a hex color
	function darken(hex) {
		let color = parseInt(hex.slice(1), 16);
		let r = (color >> 16) - 30;
		let g = ((color >> 8) & 0x00ff) - 30;
		let b = (color & 0x0000ff) - 30;
		r = Math.max(r, 0);
		g = Math.max(g, 0);
		b = Math.max(b, 0);
		const darkenedColor = (r << 16 | g << 8 | b);
		return `#${darkenedColor.toString(16).padStart(6, '0')}`;
	}

	// Reactively update theme when activeTab or themeColor changes
	$: {
		const tab = $activeTab;
		const color = $themeColor;

		const isCounterActive = tab === 'counter';
		const themeColorValue = isCounterActive ? color : '#007bff';
		const themeBackground = isCounterActive ? color : '#ffffff';
		const themeText = isCounterActive ? '#ffffff' : '#000000';
		const themeButtonHover = isCounterActive ? darken(color) : '#0056b3';

		document.documentElement.style.setProperty('--theme-bg', themeBackground);
		document.documentElement.style.setProperty('--theme-text', themeText);
		document.documentElement.style.setProperty('--theme-button', themeColorValue);
		document.documentElement.style.setProperty('--theme-button-hover', themeButtonHover);
	}
</script>
