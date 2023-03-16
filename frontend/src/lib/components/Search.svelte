<script>
    import Fa from 'svelte-fa';
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
    import { supabase } from '../supabaseClient';

    let query = ""; 
    let placeholder = "Use double quotes to search for an exact phrase";
    let results = [];
    export let resultsVisible;
    export let transportTo;
    export let selectedDocument;
    export let hoverOnDocument;
    export let hoverOffDocument;
    export let displaySaved;

    async function getRandomTitle(){
        const {data, error} = await supabase.rpc('get_random_title');
        placeholder = data;
    }

    async function search(){
        const { data, error } = await supabase.from('documents')
                                              .select()
                                              .textSearch('fts', query, {type: "websearch", config: "english"})
                                              .limit(20);
        results = data;
        resultsVisible = true;
    }

    function handleClick(document){
        hoverOffDocument();
        transportTo(document.x, document.y);
        selectedDocument = document;
        resultsVisible = false; 
        displaySaved = false; 
    }

    // getRandomTitle();
    
</script>

<div id = "search" class:results={resultsVisible}>
    <form on:submit|preventDefault={search}>
        <Fa id = "icon" icon={faMagnifyingGlass} />
        <input bind:value={query} {placeholder}>
    </form>
</div>

{#if resultsVisible}
    <div id = "results">
        {#if results.length}
            {#each results as result}
                <div class = "result" 
                    on:mouseover={() => hoverOnDocument(result)} 
                    on:mouseout={hoverOffDocument}
                    on:focus={() => hoverOnDocument(result)} 
                    on:blur={hoverOffDocument} 
                    on:click={() => handleClick(result)}
                >
                    {result.title}
                </div>
            {/each}
        {:else}
            <div id = "no-results">No results found.</div> 
        {/if}
    </div>
{/if}

<style>
    #search{       
        top: 1.2rem;    
        /* border: 4px solid #A3A0A9; */  
        box-shadow: 0 4px 9px #A3A0A9;  
        padding: 0.7rem 1.2rem;   
        color: #c6c5c8;
    } 

    input{
        width: 100%;
        position: absolute;
        border: none;
        background: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        top: 50%;
        left: 0;
        padding-left: 45px;
        padding-right: 25px;
        box-sizing: border-box;
        font-size: 0.9rem;
        transform: translateY(-50%);
    }

    input:focus{
        outline: none;
    }

    #search, #results{
        position: absolute;
        left: 1.5rem;
        width: min(400px, 100%);
        background-color: white;
        border-radius: 5px;
        z-index: 100;
        box-sizing: border-box;
        font-size: 1rem;   
    }

    #results{
        top: 3.7rem;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        box-shadow: 0 4px 9px -4px #A3A0A9;
        border-top: 1px solid #ececee;
        padding: 0.5rem 0;
        max-height: 50vh;
        overflow-y: scroll;
    }

    #no-results{
        color: #c6c5c8;
        padding: 0.2rem 1.2rem; 
    }

    .result{
        padding: 0.4rem 1.2rem;  
        font-size: 0.9rem;
        color: #6d6c70;
        overflow: hidden;
        cursor: pointer;
        transition: 0.2s all;
    }

    .result:hover{
        background-color: #f6f6f6;
    }

    #search.results{
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        box-shadow: 0 4px 9px #A3A0A9;
    }

    #icon{
        position: absolute;
    }
</style>