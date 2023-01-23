
<script lang="ts">
    import type { Document } from '../types/Document';

    export let document: Document;
</script>

<div class = "document" data-filename="{document.filename}">
    <h1>{document.title}</h1>
    <p class = "author">{document.author}</p>

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

<style>
    .document{
        width: 250px;
        border: 15px solid rgba(40, 67, 135, 0.3);
        padding: 10px;
        cursor: pointer;
        background: white;
        left: 50%; 
        top: 50%;
        transform: translate(-50%, -50%); 
        position: absolute;
        transition: 0.2s all;
        box-sizing: content-box;
    }

    .document:hover{
        border-width: 18px;
    }

    h1{
        font-size: 1.2em;
        margin: 0;
    }

    p{
        margin: 0;
    }

    .text{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 5;
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