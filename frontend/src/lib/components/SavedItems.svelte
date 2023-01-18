<script>
    import Fa from 'svelte-fa'
    import { faXmark } from '@fortawesome/free-solid-svg-icons'

    export let displaySaved;
</script>

<div id = "saved-items" class:selected="{displaySaved}" >
</div>

<style>
    #saved-items{
        position: absolute;
        width: 25vw;
        height: 100vh;
        top: 0;
        right: -25vw;
        background: white;
        transition: 0.4s all;
    } 

    #saved-items.selected{
        right: 0;
        box-shadow: -4px 0px 4px 1px #cdcbd1;
    }
</style>