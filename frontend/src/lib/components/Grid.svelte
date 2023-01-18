
<script>
    import { supabase } from '../supabaseClient';
    import Document from "./Document.svelte";
    import Search from "./Search.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount } from 'svelte';

	let saved = {};
    let displaySaved = false;
    let selectedDocument = null;
    let documents;

	onMount(async () => {
		let {data, error} = await supabase
            .from('documents')
            .select();

        documents = data; 
	});

    function documentClick(document){
        selectedDocument = document;
    }

    function handleSave(document){
        console.log("yooo", saved, document.filename in saved)
        if(document.filename in saved) delete saved[document.filename];
        else saved[document.filename] = document;

        saved = saved;
    }

</script>
    
<Search/>
<BagButton bagCount={Object.keys(saved).length} handleClick={() => {displaySaved = !displaySaved}} displaySaved={displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo displaySaved={displaySaved} bind:selectedDocument={selectedDocument} handleSave={handleSave} saved={saved}/>
<SavedItems displaySaved={displaySaved}/>


<div id = "grid" on:click|self={() => {selectedDocument = null;}}>
    {#if documents}
    <Document document={documents[0]} handleClick={() => documentClick(documents[0])}/>
    {/if}
</div>

<style>
    #grid{
        width: 100vw;
        height: 100vh;
    }

</style>