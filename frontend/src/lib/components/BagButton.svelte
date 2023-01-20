<script lang="ts">
    import Fa from 'svelte-fa';
    import { faBoxArchive } from '@fortawesome/free-solid-svg-icons';
    import {savedItems} from '../store.js';
    import { onDestroy } from 'svelte';

    // Get number of saved items from store
    let bagCount = 0;
    const unsubscribe = savedItems.subscribe((value) => bagCount = Object.keys(value).length);
    onDestroy(unsubscribe);

    export let handleClick: () => void;
    export let displaySaved: boolean;
    export let displayDocumentInfo: boolean;
    
</script>

<div id = "bag-button" on:click={handleClick} class:two="{displaySaved && displayDocumentInfo}" class:one="{(displaySaved || displayDocumentInfo) && !(displaySaved && displayDocumentInfo)}" >
    <Fa id = "icon" icon={faBoxArchive} />
    {#if bagCount > 0}
    <div id = "indicator">{bagCount}</div>
    {/if}
</div>

<style>
    #bag-button{
        position: absolute;
        top: 1.2rem;
        right: 1.5rem;
        background-color: white;
        border-radius: 100%;
        box-sizing: border-box;
        padding: 0.7rem 0.8rem;
        color: #A3A0A9;
        font-size: 1rem; 
        box-shadow: 0 4px 9px #A3A0A9;
        cursor: pointer;
        transition: 0.4s all;
        z-index: 100;
    } 

    #bag-button.one{
        right: calc(1.5rem + 25vw);
    }

    #bag-button.two{
        right: calc(1.5rem + 50vw);
    }


    #indicator{
        position: absolute;
        bottom: -2px;
        right: -2px;
        background-color: #284387;
        color: white;
        width: 15px;
        height: 15px;
        font-size: 10px;
        text-align: center;
        line-height: 15px;
        border-radius: 100%;
    }
</style>