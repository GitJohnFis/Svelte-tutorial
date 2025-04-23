<script>
//create reactive state
	let count = 0;
	let savedCounts = []; //array
	let lastSavedCount = false; //boolean
	
	let doubleClick = false; //boolean
	let showModal = false; //boolean
	let modalMessage = ""; //string

	function reset() {
		//capture before reseting
		lastSavedCount = count;
		count = 0;
	}

	function saveCount() {
		savedCounts = [...savedCounts, count];
		console.log("Saved count:", savedCounts);
		count = 0;
	}

	function clickDown() {
		count += doubleClick ? 2 : 1;
	}

	function getDoubleCount() {
		doubleClick = !doubleClick;
		console.log()
		modalMessage = `Double click is now ${doubleClick ? 'ON' : 'OFF'}`
		showModal = true;

		//hide modal after 1.5 seconds
		setTimeout(() => {
			showModal = false;
		},1500);
	}

</script>
{#if showModal}
	<div class="modal">{modalMessage}</div>
{/if}

<button on:click={clickDown} on:dblclick={getDoubleCount} style="cursor: pointer;">
	count is {count} {#if doubleClick}(x2){/if}
</button>

<button on:click={reset}>
		reset
</button>

<button on:click={saveCount}>
	save count
</button>

{#if savedCounts !== null}
	<p style="margin: 0;">Saved counts: {savedCounts.join(" - ")}</p>
{/if}


{#if lastSavedCount !== null}
	<p style="margin: 0;">Last saved counts: {lastSavedCount}</p>
{/if}
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
