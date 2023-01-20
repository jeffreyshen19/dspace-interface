
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import Search from "./Search.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount } from 'svelte';

    let displaySaved: boolean = false;
    let selectedDocument: Document = null;
    let documents: Document[];

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
    <DocumentBox document={documents[0]} handleClick={() => {selectedDocument = documents[0]}}/>
        <DocumentBox document={documents[1]} handleClick={() => {selectedDocument = documents[1]}}/>
    {/if}
</div>

<style>
    #grid{
        width: 100vw;
        height: 100vh;
    }

</style>