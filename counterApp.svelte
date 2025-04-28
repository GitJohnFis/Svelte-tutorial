<script>
	//import stored state	
	import { onMount, derived } from 'svelte';
	import { countStore, savedCountsStore, lastSavedCountStore, themeColor } from "./store";
	import CountButton  from './Countbutton.svelte';
	import { get, writable, derived as svelteDerived } from 'svelte/store';
  import { countStep, doubleClickEnabled, resetSettings  } from './settings.js';
	import ThemeColors from './ThemeColors.svelte';
	//import settings app js file
//uncreate reactive state
		// create a analytics tab
	let activeTab = 'counter';
	let showModal = false; // boolean
	let modalMessage = ""; // string
	let loading = true;
	let status = 'Initializing...';
	let startupPromise;
	// Store to control visibility of the subscribe popup
	let yes = writable(false); // initialize as false (unchecked)
	let showSubscribePopup = writable(false);
	let showPopupTimeout;
	let userEmail = writable('');

	
	// random fidget
	// let m = { x: 0, y: 0 };
	//  onpointermove={(event) => {
	// m.x = event.clientX;
	// m.y = event.clientY;
	// }}
	
// reactively lets you use $countStore
  $: document.title = `Count: ${countStore}`;
	$: currentThemeColor = $themeColor;


	function saveCount() {
		const current = get(countStore);
		savedCountsStore.update( arr => [...arr, current]);
		console.log("Saved count:", get(savedCountsStore));
			// count = 0;
		reset();
		// lastSavedCountStore.set(current);

		// countStore.set(0);
	}

	function reset() {
		//capture before reseting
		lastSavedCountStore.set(get(countStore));
		countStore.set(0);
	}	

	function updateCount() {
		const step = get(countStep);
		const isDbl = get(doubleClickEnabled);
		
		// Update the count based on the step and double count setting
		countStore.update(c => c + (isDbl ? step * 2 : step));
	}
//function to initialize app with simulated delay + error chance
	 
		function initiateApp() {
			startupPromise = new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				const shouldFail = Math.random() > 0.3;
				if(shouldFail){
					status = '❌ Not Ready';
					reject(new Error('Failed to initialize'));
				} else {
					loading = false;
				status = '✅ Ready';
				// simulated app initialization (1.5s delay)
				resolve(status);
				}	
			}, 1500);
	
		return () => clearTimeout(timer);
			
		});
		}
	
	onMount(() => {
		 initiateApp();
	 });
// retry mechanism
	function retryStartup() {
		loading = true;
		status = '⏳ Retrying...';
		initiateApp();
	}
	
	// function to Show the popup after a specific duration*enough usage* (e.g., 10 seconds)
	function showPopupAfterDelay() {
		setTimeout(() => {
			showSubscribePopup.set(true);
		}, 30000) // 10 seconds
	
	}
	
// closure of the popup function
	function closePopup() {
		showSubscribePopup.set(false);
	}
	// fuynction for subscribe button clicks + funtion to open the email client with the user's email adress pre-filled
	function subscribe() {
		const email = $userEmail.trim();
		if($yes && email){
			// Open a new page with user's email in the URL
			// const encodeEmail = encodeURIComponent(userEmail);
			const mailtoLink = `mailto:${userEmail.trim()}?subject=Subscription&body=I'm interested in recieving emails.`
			window.open(mailtoLink, "_blank");//`/thank-you?email={encodedEmail}`
			closePopup();
		} else {
			alert('Please agree and enter your email.');
		}
	}


	
	// Simulated promise (e.g., API call or setup process)
	// const startupPromise = new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		resolve('ready'); // could be data too
	// 	}, 3000); // 3 second fake delay
	//  });
	const total = svelteDerived(savedCountsStore, counts => counts.length);
	const average = svelteDerived(savedCountsStore, counts => counts.length ? (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(2) : 0);
	const max = svelteDerived(savedCountsStore, counts => counts.length ? Math.max(...counts) : 0);
	const min = svelteDerived(savedCountsStore, counts => counts.length ? Math.min(...counts) : 0);

	showPopupAfterDelay();
</script>
{#await startupPromise}
	<p style="display: flex; justify-content: center; align-items: center; height: 100vh;
						width: 100vw; font-size: 1.5rem;"><span class="spinner-animation">⏳</span> Loading counter app...</p>
{:then status}
	<ThemeColors />
	<div style="color: var(--theme-text); background-color: var(--theme-bg); min-height: 100vh;">
	<div style="margin-bottom: 1rem; ">
	<button on:click={() => activeTab = 'counter'} class:active={activeTab === 'counter'} style="padding: 0.5rem 1rem; margin-right: 0.5rem; border: none; background-color: {activeTab === 'counter' ? 'steelblue' : 'lightgray'}; color: {activeTab === 'counter' ? 'white' : 'black'}; cursor: pointer; border-radius: 6px;">Counter</button>
	<button on:click={() => activeTab = 'stats'} class:active={activeTab === 'stats'} style="padding: 0.5rem 1rem; margin-right: 0.5rem; border: none; background-color: {activeTab === 'stats' ? 'steelblue' : 'lightgray'}; color: {activeTab === 'stats' ? 'white' : 'black'}; cursor: pointer; border-radius: 6px;">Stats</button>
		<button on:click={() => activeTab = 'settings'} class:active={activeTab === 'settings'} style="padding: 0.5rem 1rem; margin-right: 0.5rem; border: none; background-color: {activeTab === 'settings' ? 'steelblue' : 'lightgray'}; color: {activeTab === 'settings' ? 'white' : 'black'}; cursor: pointer; border-radius: 6px;">⚙️Settings</button>
	</div>
	<!-- App only renders after promise resolves -->
{#if showModal}
	<div class="modal">{modalMessage}</div>
{/if}
	<!--The pointer is at {Math.round(m.x)} x {Math.round(m.y)}-->

	{#if activeTab === 'counter'}
<CountButton label="Count"
	on:click={updateCount}
	on:toggle={e => {
		modalMessage = e.detail.message;
		showModal = true;

		setTimeout(() => {
			showModal = false;
		}, 1500);
	}}
		
	}}/> 
	<button on:click={reset} style="background-color: var(--theme-button-hover); color: var(--theme-text);">
		reset
 </button>

<button on:click={saveCount} style="background-color: var(--theme-button-hover); color: var(--theme-text);">
	save count
</button>

	
{#if $savedCountsStore !== null}
	<p style="margin: 0;">Saved counts: {$savedCountsStore.join(" - ")}</p>
{/if}


{#if typeof $lastSavedCountStore === 'number'}
	<p style="margin: 0;">Last saved counts: {$lastSavedCountStore}</p>
{/if}
	
	{:else if activeTab === 'stats'}
		<h2>Analytics</h2>
		<p>Total saved: {$total}</p>
		<p>Average: {$average}</p>
		<p>max: {$max}</p>
		<p>min: {$min}</p>
		<button on:click={() => savedCountsStore.set([])}>Clear Saved Counts</button>

		{:else if activeTab === 'settings'}
		<h2>Settings</h2>
		<p>Here you can configure app settings</p>
		<div style="margin-bottom: 1rem;">
		<label for="countStep">Count Step:</label>
      <input id="countStep" type="number" min="1" max="10" bind:value={$countStep} />
      	<p>Adjust the step value for count increments.</p>
		</div>
		<div style="margin-bottom: 1rem;">
			<label for="themeColor">Theme Color:</label>
      <input id="themeColor" type="color" bind:value={$themeColor} />
		<p>Change the theme color of the app.</p>
		</div>
		<div style="margin-bottom: 1rem;">
		<label for="doubleClickEnabled">Enable double count:</label>
		<input type="checkbox" id="doubleCount" bind:checked={$doubleClickEnabled} />
		 	<p>Toggle to enable or disable double counting.</p>
		</div>
	<div style="margin-top: 2rem;">
		<button on:click={resetSettings} style="align-items: center;" >
			🔄 reset settings
		</button>
	</div>
	{/if}
		{#if $showSubscribePopup}
			<div class="popup">
				<button class="close-popup"on:click={closePopup}>X</button>
			<label>
				<input type="checkbox" bind:checked={$yes}/>
				Yes! send me regular email spam
			</label>

				<div style="margin-top: 1rem;">
						<input type="email" placeholder="Your email..." bind:value={$userEmail} />
				</div>
		{#if $yes}
			<p>Thank you. We will bombard your inbox and sell your personal details.</p>
		{:else}
			<p>You must opt in to continue. If you're no paying, you're are the product.</p>
		{/if}
		<!-- disabled subscribe button if checkbox is unchecked -->
		<button on:click={subscribe} disabled={$userEmail.trim() === ''}>Subscribe</button>
			</div>
		{/if}
	</div>
<!-- <div onkeydowncapture={(e) => alert(`<div> ${e.key}`)} role="presentation">
	<input onkeydowncapture={(e) => alert(`<input> ${e.key}`)} />
</div> -->
{:catch error}
	<p style="text-align: center;">❌ App failed to load.</p>
	<p style="text-align: center;">Error: ${error.message}</p>
	<p style="text-align: center;">Status: {status}</p>
	<button on:click={retryStartup} style="display: block; margin: 2rem auto; align-items: center; justify-content: center; align-items: center; background-color: #007bff; color: white;" on:mouseover={e =>  e.target.style.backgroundColor = '#0056b3'} on:mouseout={e => e.target.style.backgroundColor = '#007bff'} on:focus{} on:blur{}>🔄 Try again</button>
{/await} 

<style>
	.modal{
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: grey;
		color: white;
		padding: 1rem 2rem;
		border-radius: 10px;
		box-shadow: 0 2px 8px black; // make the color 20% opacity
		font-weight: bold;
		z-index: 1000;
	}

	.tabs button.active {
    background-color: steelblue;
    color: white;
  }
	.popup{
	position: fixed;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -30%);
		background: white;
		padding: 2rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		z-index: 1000;
	}
.close-popup{
	position: absolute;
		top: 10px;
		right: 10px;
		background: transparent;
		border: none;
		transition: opacity 0.2s ease; /* less visual exit */
		color: #aaa;
		opacity: 0.6; /* slightlyfadedthanaHo */
	  font-weight: normal;
		font-size: 0.9rem;
		cursor: pointer;
}
	.close-popup:hover{
		color: black;
	}
	.popup button:disabled {
background-color: #ccc;
	} 
	.popup p {
		  font-size: 1rem;
    color: #333;
	}
	input[type=email]{
	width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
	/*
	fallback incase the emoji does not load
	.loader {
  border: 4px solid #ccc;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
} */
	:global(.spinner-animation){
		display: inline-block;
		animation: spin 1s linear infinite;
		transform-orgin: center;
		margin-right: 0.5rem;
	}
	@keyframes spin{
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	button:hover{
		background-color: var(--theme-button-hover);
		margin: 0;
		gap: 1;
	}
	p{
		color: black;
		font-weight: bold;
	}
	:root{
		--theme-bg: white;
		--theme-text: #000000;
		--theme-button: #007bff;
		--theme-button-hover: #0056b3;
	}
</style>


/*

//initialize code
<script>
onMount(async () => {
	//handle promise
});
</script>

//side-effect
<script>
let count;


$: document.title = `count is ${count}`
</script>

//create computated state
<script>
let count;

$: doubled = count * 2
$: document.title = `count is ${count}`
</script>

//conditional logic

<script>
	let count = 0;
</script>

{#if count > 1000}
	<p>big</p>
{:else if count > 500}
	<p>medium</p>
{:else}
	<p>small</p>
{/f}


//loops
<script>
	const items = [
		{ id: 1, name: "foo" },
		{ id: 2, name: "bar" },
		{ id: 3, name: "ball" },
	]
</script>

{#each items as item (item.id)}
	<p>{item.name}</p>
{/each}


//shared state

//in store.js file
import { writable } from "svelte/store";

export const countStore = writable(0);


<script>
	import { countStore } from "./store"
</script>

<button on:click={() => countStore.update(c => c + 1)}>
count is {$countStore}
</button>

//features
//surgical precision
//zero boilerplate
//bonus* automatic disposal

//promises

<script>
	import {LoadingSpinner, ErrorPage} from

	const promise = Promise.resolve(420);
</script>

{#await promise}
	<LoadingSpinner />
{:then number}
 <p>The number is {number}</p>
{:catch error}
 <ErrorPage {error} />
{/await}


*/
