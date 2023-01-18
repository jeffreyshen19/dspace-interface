
<script>
    export let document;
    export let handleClick;
    console.log(document)
</script>

<div class = "document" on:click={handleClick}>
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
        width: 300px;
        border: 15px solid rgba(40, 67, 135, 0.3);
        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;
        background: white;
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