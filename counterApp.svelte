<script>
	//import stored state	
	import { onMount } from 'svelte';
	import { countStore, savedCountsStore, lastSavedCountStore, doubleClickStore } from "./store";
	import { get } from 'svelte/store';

	
//uncreate reactive state
	let showModal = false; //boolean
	let modalMessage = ""; //string
	let loading = true;
	let status = 'Initializing...';
	let startupPromise;
// reactively lets you use $countStore
$: document.title = `Count: ${countStore}`;
	
	function reset() {
		//capture before reseting
		lastSavedCountStore.set(get(countStore));
		countStore.set(0);
	}

	function saveCount() {
		const current = get(countStore);
		savedCountsStore.update( arr => [...arr, current]);
		console.log("Saved count:", get(savedCountsStore));
			// count = 0;
	}

	function clickDown() {
		doubleClickStore.update(double => {
				countStore.update(c => c + (double ? 2 : 1));
				return double;
			});
	}

	function getDoubleCount() {
		doubleClickStore.update(double => {
				const newState = !double;
				console.log()
				modalMessage = `Double click is now ${newState ? 'ON' : 'OFF'}`
				showModal = true;

				//hide modal after 1.5 seconds
				setTimeout(() => {
				showModal = false;
				},1500);
				return newState;
		});
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

	
	// Simulated promise (e.g., API call or setup process)
	// const startupPromise = new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		resolve('ready'); // could be data too
	// 	}, 3000); // 3 second fake delay
	//  });
	

	
</script>
{#await startupPromise}
	<p style="display: flex; justify-content: center; align-items: center; height: 100vh;
						width: 100vw; font-size: 1.5rem;"><span class="spinner-animation">⏳</span> Loading counter app...</p>
{:then status}
	
<!-- App only renders after promise resolves -->
{#if showModal}
	<div class="modal">{modalMessage}</div>
{/if}

<button on:click={clickDown} on:dblclick={getDoubleCount} style="cursor: pointer;">
	count is {$countStore} {#if $doubleClickStore}(x2){/if}
</button>

<button on:click={reset}>
		reset
</button>

<button on:click={saveCount}>
	save count
</button>

{#if $savedCountsStore !== null}
	<p style="margin: 0;">Saved counts: {$savedCountsStore.join(" - ")}</p>
{/if}


{#if typeof $lastSavedCountStore === 'number'}
	<p style="margin: 0;">Last saved counts: {$lastSavedCountStore}</p>
{/if}
{:catch error}
	<p style="text-align: center;">❌ App failed to load.</p>
	<p style="text-align: center;">Error: ${error.message}</p>
		 <p style="text-align: center;">Status: {status}</p>
<button on:click={retryStartup} style="align-items: center;">🔄 Try again</button>
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
		background-color: red;
		margin: 0;
		gap: 1;
	}
	p{
		color: black;
		font-weight: bold;
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
