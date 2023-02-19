
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentStub from "./DocumentStub.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount, afterUpdate } from 'svelte';
    import Fa from 'svelte-fa';
    import { faCircleNotch, faY, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

    let width; let height;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    let displaySaved = false;
    let loading;

    const pageSize = 20;
    let page = 0;
    let numPages = 0;
    let totalCount = 0;
    let paginationOffset = 0;
    $: numPages = Math.ceil(totalCount / pageSize);
    $: paginationOffset = Math.max(0, page - 1);

    let query = ""; 
    let placeholder = "";

    async function getRandomTitle(){
        const {data, error} = await supabase.rpc('get_random_title');
        placeholder = data;
    }

    async function getData(){
        loading = true;

        var url = new URL(window.location.href);
        url.searchParams.set('p', "" + page);
        url.searchParams.set('q', query);
        window.history.replaceState(null, "", url.toString())

        const { data, count } = await supabase.from('documents')
                                              .select("*", {count: "estimated"})
                                              .textSearch('fts', query, {type: "websearch", config: "english"})
                                              .range(page * pageSize, (page + 1) * pageSize - 1);

        documents = data;
        totalCount = count;
        loading = false;
    }

    async function search(){
        page = 0;
        getData();
    }

    async function goToPage(i){
        page = i; 
        getData();
        document.querySelector("body").scrollTop = 0;
    }

	onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        page = parseFloat(urlParams.get("p")) || 0;
        query = urlParams.get("q") || "";

        if(query.length) getData();
        
        getRandomTitle();
	});

    function onKeyDown(event){
        switch(event.key.toLowerCase()){
            case "escape":
                selectedDocument = null; 
                displaySaved = false; 
                break;
        }
    }

</script>
    
<BagButton handleClick={() => {displaySaved = !displaySaved}} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo control={true} {displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>

<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
    on:keydown={onKeyDown}
/>

{#if loading}
    <div id = "overlay"></div>

    <span id = "loading">
        <Fa icon={faCircleNotch} size="3x" spin />
    </span>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id = "wrapper" on:click|self={() => {selectedDocument = null;}}>
    <div id = "search" >
        <form on:submit|preventDefault={search}>
            <Fa id = "icon" icon={faMagnifyingGlass} />
            <input bind:value={query} {placeholder}>
        </form>
    </div>

    <p>
        {#if documents != null && documents.length}
            Showing items {page * pageSize + 1}-{(page + 1) * pageSize} of {totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.
        {:else}
            No results found.
        {/if}
    </p>

    {#if documents != null}
        {#each documents as document}
            <div>
                <DocumentStub {document} bind:selectedDocument={selectedDocument} />
            </div>
        {/each}
    {/if}

    {#if documents != null && documents.length}
        <div id = "pagination">
            {#if page == 0}
                <p>{"<"}</p>
            {:else}
                <p style:color="rgb(79, 99, 148)" style:cursor="pointer" on:click={() => goToPage(page - 1)}>{"<"}</p>
            {/if}

            {#each Array(Math.min(numPages, 10)) as _, i}
            
                {#if paginationOffset + i < numPages }
                    {#if paginationOffset + i == page}
                        <p>{paginationOffset + i + 1}</p>
                    {:else}
                        <p style:color="rgb(79, 99, 148)" style:cursor="pointer" on:click={() => goToPage(paginationOffset + i)}>{paginationOffset + i + 1}</p>
                    {/if}
                {/if}
                
            {/each}

            {#if page == 0}
                <p>{">"}</p>
            {:else}
                <p style:color="rgb(79, 99, 148)" style:cursor="pointer" on:click={() => goToPage(page + 1)}>{">"}</p>
            {/if}
        </div>
    {/if}
</div>



<style>
    #pagination{
        display: flex;
        gap: 10px;
    }

    #search{       
        border-radius: 5px;
        box-shadow: 0 4px 9px #A3A0A9;  
        padding: 0.7rem 1.2rem;   
        color: #c6c5c8;
        width: min(400px, 100%);
        box-sizing: border-box;
        font-size: 1rem;
        margin-bottom: 3em;
        position: relative;
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

    #wrapper{
        box-sizing: border-box;
        padding: 2rem 2.5rem;
    }

    #overlay{
        z-index: 99;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(181, 181, 181, 0.3);
        backdrop-filter: blur(1px);
    }

    #loading{
        position: absolute;
        z-index: 102;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    svg{
        width: 100%;
        height: 100%;
    }
</style>