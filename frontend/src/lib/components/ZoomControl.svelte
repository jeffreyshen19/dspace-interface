<script lang="ts">
    import Fa from 'svelte-fa';
    import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

    export let displaySaved: boolean;
    export let displayDocumentInfo: boolean;

    export let zoomOut;
    export let zoomIn;
    
</script>

<div id = "zoom-control" class:two="{displaySaved && displayDocumentInfo}" class:one="{(displaySaved || displayDocumentInfo) && !(displaySaved && displayDocumentInfo)}" >
    <div class = "icon" on:click={zoomIn}><Fa id = "icon" icon={faPlus} /></div>
    <div class = "icon" on:click={zoomOut}><Fa id = "icon" icon={faMinus} /></div>
</div>

<style>
    #zoom-control{
        position: absolute;
        bottom: 1.2rem;
        right: 1.5rem;
        background-color: white;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0;
        color: #A3A0A9;
        font-size: 1rem; 
        box-shadow: 0 4px 9px #A3A0A9;
        cursor: pointer;
        transition: 0.4s all;
        z-index: 100;
    } 

    .icon{
        padding: 0.6rem 0.8rem;
        transition: 0.2s all;
    }

    .icon:nth-child(1){
        border-bottom: 1px solid #d4d4d5;
    }

    .icon:hover{
        background-color: #f6f6f6;
    }

    #zoom-control.one{
        right: calc(1.5rem + 25vw);
    }

    #zoom-control.two{
        right: calc(1.5rem + 50vw);
    }
</style>