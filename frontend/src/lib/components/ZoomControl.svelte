<script lang="ts">
    import Fa from 'svelte-fa';
    import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

    export let zoomOut;
    export let zoomIn;
    export let expanded;
    export let displaySaved: boolean;
    export let displayDocumentInfo: boolean;
    let right;

    $: {
        let right_vw = 0;
        let right_px = 200;

        if(displaySaved && displayDocumentInfo) right_vw = 50;
        if(displayDocumentInfo != displaySaved ) right_vw = 25; 
        if(expanded) right_px += 200;

        right = "calc(1.5rem + " + (right_px + 10) + "px + " + right_vw + "vw)"
    }

</script>

<div id = "zoom-control" style:right={right} class:expanded="{expanded}">
    <div class = "icon" on:click={zoomIn}><Fa id = "icon" icon={faPlus} /></div>
    <div class = "icon" on:click={zoomOut}><Fa id = "icon" icon={faMinus} /></div>
</div>

<style>
    #zoom-control{
        position: absolute;
        bottom: 1.2rem;
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

    #zoom-control.expanded{
        right: calc(1.5rem + 410px);
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

</style>