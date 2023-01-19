
<script>
    import { supabase } from '../supabaseClient';
    import Document from "./Document.svelte";
    import Search from "./Search.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount } from 'svelte';
    import {savedItems} from '../store.js';

    let displaySaved = false;
    let selectedDocument = null;
    let documents;

	onMount(async () => {
		let {data, error} = await supabase
            .from('documents')
            .select();

        documents = data; 
	});

</script>
    
<Search/>
<BagButton handleClick={() => {displaySaved = !displaySaved}} displaySaved={displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>


<div id = "grid" on:click|self={() => {selectedDocument = null;}}>
    {#if documents}
    <Document document={documents[0]} handleClick={() => {selectedDocument = documents[0]}}/>
        <Document document={documents[1]} handleClick={() => {selectedDocument = documents[1]}}/>
    {/if}
</div>

<style>
    #grid{
        width: 100vw;
        height: 100vh;
    }

</style>