
<script lang="ts">
    import type { Document } from '../types/Document';
    import { savedItems, taskData, sessionData } from '../store.js';

    export let document: Document;
    export let selectedDocument: Document;

    function handleClick(){
        selectedDocument = document;

        // Update items clicked
        if(!("itemsClicked" in $taskData)) return;
        let itemsClicked = $taskData["itemsClicked"];
        if(itemsClicked.indexOf(document.filename) == -1) itemsClicked.push(document.filename);
        let temp = $taskData;
        temp["itemsClicked"] = itemsClicked;
        taskData.set(temp);
    }

    
</script>

<div class = "document">
    <div class = "container">
        <div class = "img"><img src ="{document.image_url}"/></div>
        <div class = "content">
            <h1 on:click={handleClick}>{document.title}</h1>
            {#if document.author}
                <p class = "author">{document.author}</p>
            {/if}
            
        
            {#if document.abstract}
                <p class = "text">{document.abstract}</p>
                <br>
            {/if}
            
            {#if document.subject}
                <strong>Subject</strong>
                <br>    
                <p class = "subject">{document.subject.replace(".", "")}</p>
            {/if}     
        </div>   
    </div>
</div>

<style>
    .document{
        width: min(100%, 700px);
        padding: 0;
        box-sizing: content-box;
        margin-bottom: 3em;
    }

    .container{
        display: flex;
        flex-wrap: nowrap;
        gap: 15px;
    }

    .img{
        width: 100px;
    }

    img{
        width: 100px;
    }

    h1{
        font-size: 1.2em;
        margin: 0;
        word-break: break-word;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        cursor: pointer;
        transition: 0.2s all;
    }

    h1:hover{
        color: rgb(79, 99, 148);
    }

    p{
        margin: 0;
    }

    .text{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .author{
        color: #89878D;
        margin: 0.5rem auto;
    }
    
    strong{
        margin-bottom: 0.5rem;
    }
</style>