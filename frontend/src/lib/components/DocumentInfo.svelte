<script lang="ts">
    import Fa from 'svelte-fa'
    import { faXmark } from '@fortawesome/free-solid-svg-icons'
    import { savedItems } from '../store.js';
    import { getDocumentColor } from '../colors.js';
    import type { Document } from '../types/Document';
    import { onMount } from 'svelte';

    export let displaySaved: boolean;
    export let selectedDocument: Document;
    
    function handleSave(document: Document){
        let temp = $savedItems;
        if(document.filename in temp) delete temp[document.filename];
        else temp[document.filename] = document;

        savedItems.set(temp);
    }
</script>

<div id = "document-info" class:two="{displaySaved && selectedDocument != null}" class:one="{selectedDocument != null && !displaySaved}">
    <div class = "close" on:click={() => {selectedDocument = null}}>
        <Fa icon={faXmark} />
    </div>

    {#if selectedDocument}
        <h1>{selectedDocument.title}</h1>
        <p class = "author">{selectedDocument.author}</p>
        <br>

        <div id = "container">
            <img src ="{selectedDocument.image_url}">
            <div id = "buttons">
                <a class = "button" target = "_blank" href = "{selectedDocument.uri}">View on DSpace</a>
                <a class = "button" target = "_blank" href = "https://dspace.mit.edu/bitstream/handle/{selectedDocument.handle}/{selectedDocument.filename.replace(".txt", "")}">Download</a>
                <a class = "button" class:inverted="{selectedDocument.filename in $savedItems}" on:click={() => handleSave(selectedDocument)}>
                    {#if selectedDocument.filename in $savedItems}
                        Saved
                    {:else}
                        Save Document
                    {/if}
                </a>
                
                
            </div>   
            
        </div>

        {#if selectedDocument.subject}
            <br><strong>Subject</strong><br>
            <p>{selectedDocument.subject.replace(".", "")}</p>
        {/if}

        {#if selectedDocument.issued}
            <br><strong>Issued</strong><br>
            <p>{selectedDocument.issued}</p>
        {/if}

        {#if selectedDocument.abstract}
            <br><strong>Abstract</strong><br>
            <p>{selectedDocument.abstract}</p>
        {/if}
    {/if}

</div>

<style>
    #document-info{
        position: absolute;
        width: 25vw;
        height: 100vh;
        top: 0;
        right: -25vw;
        transition: 0.4s all;
        padding: 2rem 1.5rem;
        box-sizing: border-box;
        overflow-y: scroll;
        z-index: 100;
        background: white;
    } 

    #document-info.one, #document-info.two{
        box-shadow: -4px 0px 4px 1px #cdcbd1;
    }

    #document-info.one{
        right: 0;
    }

    #document-info.two{
        right: 25vw;
    }

    .close{
        top: 0.5rem;
        right: 0.7rem;
        position: absolute;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .document{
        width: 300px;
        border: 15px solid rgba(40, 67, 135, 0.3);
        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;
    }

    #container{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    img{
        flex-grow: 1;
        min-width: 70px;
    }

    #buttons{
        flex-grow: 2;
    }

    h1{
        font-size: 1.2em;
        margin: 0;
    }

    p{
        margin: 0;
    }

    .button{ 
        display: block;
        width: 100%;
        border: 3px solid rgba(40, 67, 135, 0.3);
        padding: 10px 15px;
        box-sizing: border-box;
        margin-bottom: 5px;
        text-align: center;
        cursor: pointer;
        transition: 0.4s all;
        color: black;
        text-decoration: none;
    }

    .button:hover{
        background-color: rgba(40, 67, 135, 0.5);
        color: white;
    }

    .button.inverted{
        background-color: rgba(40, 67, 135, 0.5);
        color: white;
    }

    .button.inverted:hover{
        background-color: rgba(40, 67, 135, 0.7);
    }

    .author{
        color: #89878D;
        margin: 0.5rem auto;
    }
    
    strong{
        margin-bottom: 0.5rem;
    }
</style>