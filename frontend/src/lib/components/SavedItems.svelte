<script lang="ts">
    import Fa from 'svelte-fa'
    import { faXmark } from '@fortawesome/free-solid-svg-icons'
    import { savedItems } from '../store.js';
    import type { Document } from '../types/Document';

    export let displaySaved: boolean;
    export let selectedDocument: Document;
    
    function removeSavedItem(filename: string){
        let temp = $savedItems;
        if(filename in temp) delete temp[filename];

        savedItems.set(temp);
    }
</script>

<div id = "saved-items" class:selected="{displaySaved}" >
    <div class = "close" on:click={() => {displaySaved = false}}>
        <Fa icon={faXmark} />
    </div>

    <h1>Saved Documents</h1>
    <br>

    {#each Object.keys($savedItems) as filename}
        <div class = "document">
            <img src = "{$savedItems[filename].image_url}">
            <div class = "text">
                <h2 on:click={() => {selectedDocument = $savedItems[filename]}}>{$savedItems[filename].title}</h2>
                <p class = "author">{$savedItems[filename].author}</p>
            </div>      
            <div class = "remove-item-container">
                <div class = "remove-item" on:click={() => removeSavedItem(filename)}>
                    <Fa icon={faXmark} />
                </div>
            </div>  
        </div>
    {/each}

    {#if !Object.keys($savedItems).length}
        <p>There are no saved items.</p>        
    {/if}
</div>

<style>
    #saved-items{
        position: absolute;
        width: 25vw;
        height: 100vh;
        top: 0;
        right: -25vw;
        background: white;
        transition: 0.4s all;
        padding: 2rem 1.5rem;
        box-sizing: border-box;
        overflow-y: scroll;
        z-index: 100;
    } 

    #saved-items.selected{
        right: 0;
        box-shadow: -4px 0px 4px 1px #cdcbd1;
    }

    .document{
        display: flex;
        gap: 10px;
        margin-bottom: 1rem;
    }

    .document img{
        width: 70px;
        align-self: center;
        /* height: auto; */
    }

    .document .remove-item-container{
        position: relative;
        width: 2rem;
        text-align: center;
    }

    .document .remove-item{
        cursor: pointer;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }

    .close{
        top: 0.5rem;
        right: 0.7rem;
        position: absolute;
        font-size: 1.2rem;
        cursor: pointer;
    }

    h1{
        font-size: 1.6em;
        margin: 0;
    }

    h2{
        margin: 0;
        font-size: 1.2em;
        transition: 0.2s all;
        cursor: pointer;
        text-decoration: underline;
        text-decoration-color: transparent;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
    }

    h2:hover{
        text-decoration-color: black;
    }

    .author{
        color: #89878D;
        margin: 0.3rem auto;
    }
</style>