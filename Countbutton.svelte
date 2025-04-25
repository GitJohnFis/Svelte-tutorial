<script>
import { countStore, doubleClickStore } from './store';
import { get } from 'svelte/store';
import { createEventDispatcher } from 'svelte';


//props to handle custom label
export let label = 'Count';

const dispatch = createEventDispatcher();
	
// logic
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
			//dispatch modal message to parent
				dispatch('toggle', {
					message: `Double click is now ${newState ? 'ON' : 'OFF'}`
				});
				return newState;
		});
	}
	function handleClick() {
		dispatch('click'); // This triggers the parent handler (updateCount)
	}
</script>
<!-- UI -->
	<button on:click={handleClick} on:dblclick={getDoubleCount} style="cursor: pointer; color: white; background-color: {$doubleClickStore ? 'green' : 'forestgreen'}; transition: background-color 0.3s ease; border-radius: 6px;">
	{label}
</button>

	<!-- Show the number seperately -->
	<p style="margin-top: 0.5rem; font-size: 1.1rem; font-weight: bold;"> {$countStore} </p>
