<!-- @migration-task Error while migrating Svelte code: can't migrate `$: currentThemeColor = $themeColor;` to `$derived` because there's a variable named derived.
     Rename the variable and try again or migrate by hand. -->
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

	// access secretMopde here vvv
	let secretModeUnlocked = writable(false);

	// random fidget (Easter egg)
	let deck = [];
  let playerHand = [];
  let dealerHand = [];
	let blackjackHand = false; // check if the blackjack hand is detected 
  let playerSum = 0;
  let dealerSum = 0;
  let BJmessage = "";
  let isGameOver = false;
	let flipped = false;
	// Initialize a new deck of cards
function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = [
    { rank: 'A', value: 11 }, { rank: '2', value: 2 }, { rank: '3', value: 3 },
    { rank: '4', value: 4 },  { rank: '5', value: 5 }, { rank: '6', value: 6 },
    { rank: '7', value: 7 },  { rank: '8', value: 8 }, { rank: '9', value: 9 },
    { rank: '10', value: 10 },{ rank: 'J', value: 10 },{ rank: 'Q', value: 10 },
    { rank: 'K', value: 10 }
  ];
  deck = [];
  // Populate deck: each suit with all values
  for (const suit of suits) {
    for (const card of values) {
      deck.push({ ...card, suit });
    }
  }
  // Shuffle deck
  shuffleDeck(deck);
}

// Shuffle the deck using the Fisher–Yates algorithm
function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Deal a card to the specified hand and update sums
function dealCard(hand, flipped = true) {
console.log("Dealing card to", hand === playerHand ? "Player" : "Dealer");
    if (deck.length === 0) {
      console.warn("Deck is empty. Cannot deal a card.");
      return;
    }
  const card = { ...deck.pop(), flipped };
  hand.push(card);
  calculateSums();
}

// Calculate the sums for player and dealer hands (handles aces)
function calculateSums() {
  function sumHand(hand) {
    let sum = 0;
    let aceCount = 0;
    for (const card of hand) {
      sum += card.value;
      if (card.rank === "A") {
        aceCount++;
      }
    }
    while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }
    return sum;
  }

  playerSum = sumHand(playerHand);
  dealerSum = sumHand(dealerHand);

  // Check for Blackjack
  if (playerHand.length === 2 && playerSum === 21) {
    blackjackHand = true;
    BJmessage = "Blackjack! Player wins!";
    isGameOver = true;
  } else {
    blackjackHand = false;
  }
}

// Start a new game
function startGame(event) {
	event.stopPropagation();
	console.log("Restarting game...");
  deck = [];
  playerHand = [];
  dealerHand = [];
  playerSum = 0;
  dealerSum = 0;
  isGameOver = false;
  BJmessage = "";
  blackjackHand = false;
  flipped = false;

  createDeck();
  dealCard(playerHand, true);
  dealCard(dealerHand, true);
  dealCard(playerHand, true);
  dealCard(dealerHand, false);
  calculateSums();
}

// Reveal the dealer's hidden card
function revealDealerHand() {
  for (const card of dealerHand) {
    card.flipped = true;
  }
}

// Player draws a card
function hit() {
  if (isGameOver) return;
  dealCard(playerHand);
  if (playerSum > 21) {
    isGameOver = true;
    BJmessage = "Player busts! Dealer wins.";
  }
}

// Player stands, now dealer's turn
function stand() {
  if (isGameOver) return;
  while (dealerSum < 17) {
    dealCard(dealerHand);
  }
  if (dealerSum > 21) {
    BJmessage = "Dealer busts! Player wins.";
  } else if (dealerSum === playerSum) {
    BJmessage = "Push (tie).";
  } else if (dealerSum > playerSum) {
    BJmessage = "Dealer wins.";
  } else {
    BJmessage = "Player wins!";
  }
  isGameOver = true;
}

// Flip the card with a translate X-axis animation
  const flipCard = () => {
    console.log("Flipping card...");
    flipped = !flipped;
  };

  // Exit the game
  const exitGame = () => {
    secretModeUnlocked.set(false);
  };
// reactively lets you use $countStore
  $: document.title = `Count: ${countStore}`;
	$: currentThemeColor = $themeColor;
	$: if($min == 7 && $max == 7 && parseFloat($average) ) {
		$secretModeUnlocked = true;
	}





	 function drawCard() {
		 const card = cards[Math.floor(Math.random() * cards.length)]
		 const currentCard = card;
		 blackjackHand.push(card);
	 }





	 
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

 // Initialize the game on component mount

	
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
		{#if $secretModeUnlocked}
<!-- Secret Blackjack game here -->
		<h2 style="text-align: center;">🎉 Secret Blackjack Game 🎉</h2>
<div class="container">
	 <div class="card-container">
  <button
    class="card blackjack-card"
    style:transform={flipped ? 'rotateY(180deg)' : ''}
    style:--bg-1="palegoldenrod"
    style:--bg-2="black"
    style:--bg-3="goldenrod"
    on:click={flipCard}
  >
    <div class="front">
      <span class="symbol">
        {#if playerHand.length > 0}
          {playerHand.map(card => `${card.rank} of ${card.suit}`).join(", ")}
        {/if}
      </span>
    </div>
    <div class="back">
      <div class="pattern"></div>
    </div>
  </button>
	 </div>
  <div class="blackjack-controls" style="margin-top: 2rem;">
    <p style="color: white;">Your hand: {playerHand.map(card => `${card.rank} of ${card.suit}`).join(", ")}</p>
    <button class="blackjack-button restart-button" on:click={(e) => startGame(e)}
 aria-label="Restart the game">
        Restart Blackjack
      </button>
      <button class="blackjack-button hit-button" on:click={hit} >
        Hit
      </button>
      <button class="blackjack-button stand-button" on:click={stand} disabled={isGameOver}>
        Stand
      </button>
  </div>
			  <!-- Hidden Exit Button -->
    <button class="exit-button" on:click={exitGame}>eXit</button>
  </div>
		{/if}
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
	<p style="text-align: center;">Error: {error.message}</p>
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
	/* Crazy AI slop */
	:root {
  --bg-1: #1a1a1d;      /* dark background */
  --bg-2: #c3073f;      /* vivid red/pink */
  --bg-3: #6f2232;      /* deeper maroon */
  --accent: #950740;    /* sharp focus accent */
  --text-light: #eeeeee;
  --shadow: rgba(0, 0, 0, 0.25);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
	gap: 1.5rem;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(145deg, #0f0f10, #1c1c1f);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-light);
}
/* Card Section */
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem; /* Adds space between the card and buttons */
}

.card {
  width: 160px;
  height: 220px;
  perspective: 1000px;
  border: none;
  background: none;
  position: relative;
  margin: 1rem;
  cursor: pointer;
	transition: transform 0.6s ease;
}

.card .front,
.card .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 6px 12px var(--shadow);
  transition: transform 0.6s ease;
}

  .card .front {
    background: palegoldenrod;
    color: black;
    transform: rotateY(0);
  }

  .card .back {
    background: goldenrod;
    transform: rotateY(180deg);
  }

.card[style] {
  transition: transform 0.6s ease-in-out;
}

.pattern {
  width: 50px;
  height: 50px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
}

.blackjack-controls {
  margin-top: 2rem;
  display: flex;
	flex-direction: column;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.blackjack-button {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  background-color: transparent;
  border: 2px solid var(--accent);
  border-radius: 8px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
}
	.blackjack-button:disabled{
		 opacity: 0.6;
		cursor: not-allowed
	}

.blackjack-button:hover {
  background-color: var(--accent);
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 4px 8px var(--shadow);
}

.restart-button {
  border-color: #28a745;
  background-color: transparent;
}
.restart-button:hover {
  background-color: #28a745;
}

.hit-button {
  border-color: #17a2b8;
}
.hit-button:hover {
  background-color: #17a2b8;
}

.stand-button {
  border-color: #dc3545;
}
.stand-button:hover {
  background-color: #dc3545;
}
	/* Exit Button */
.exit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: transparent;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.exit-button:hover {
  color: red;
  background-color: rgba(255, 0, 0, 0.1);
}


	
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
