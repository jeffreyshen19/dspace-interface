<script lang="ts">
    import Fa from 'svelte-fa'
    import { faXmark } from '@fortawesome/free-solid-svg-icons'
    import { savedItems } from '../store.js';
    import type { Document } from '../types/Document';

    export let displaySaved: boolean;
    export let selectedDocument: Document;
    export let transportTo: (x:number, y:number) => void;
    
    function handleSave(document: Document){
        let temp = $savedItems;
        if(document.filename in temp) delete temp[document.filename];
        else temp[document.filename] = document;

        savedItems.set(temp);
    }

    function getPDFUrl(document: Document){
        return "https://dspace.mit.edu/bitstream/handle/" + document.handle + "/" + document.filename.replace(".txt", "");
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
            <div class = "img"><a href = "{getPDFUrl(selectedDocument)}" target = "_blank"><img src ="{selectedDocument.image_url}"></a></div>
            <div id = "buttons">
                <a class = "button" target = "_blank" on:click={() => transportTo(selectedDocument.x, selectedDocument.y)}>View on Map</a>
                <a class = "button" target = "_blank" href = "{getPDFUrl(selectedDocument)}">Download</a>
                <a class = "button" class:inverted="{selectedDocument.filename in $savedItems}" on:click={() => handleSave(selectedDocument)}>
                    {#if selectedDocument.filename in $savedItems}
                        Saved
                    {:else}
                        Save Document
                    {/if}
                </a>
                
                
            </div>   
            
        </div>

        <br><strong>URL</strong><br>
        <p><a href = "{selectedDocument.uri}">{selectedDocument.uri.replace("https://", "").replace("http://", "")}</a></p>

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

    .img{
        flex-grow: 1;
        min-width: 70px;
    }

    img{
        width: 100%;
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

    a{
        color: rgba(40, 67, 135, 0.8);
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