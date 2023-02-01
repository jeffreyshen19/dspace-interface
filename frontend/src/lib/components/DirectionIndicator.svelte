<script lang="ts">
    import Fa from 'svelte-fa';
    import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
    

    export let showDirectionIndicator;
    export let width; 
    export let height; 
    export let angle = 0; // in radians
    export let title;
    let x, y, r;
 
    $: r = Math.min(width, height) / 2 * 0.5; 
    $: x = r * Math.sin(angle) + width / 2;
    $: y = r * Math.cos(angle) + height / 2; 
</script>

<div id = "direction-indicator"
    style:bottom="{y}px"
    style:left="{x}px"
    style:opacity={showDirectionIndicator ? "100%" : "0%"}
>
    <div id = "container">
        <div id = "icon" style:transform={"rotate(" + angle + "rad)"}>
            <Fa icon={faChevronUp} />
        </div>
        
        <div id = "text">
            {title}
        </div>
    </div>

</div>

<style>
    #direction-indicator{
        position: absolute;
        z-index: 99;
        user-select: none;
        pointer-events: none;
        transition: 0.2s all;
    } 

    #container{
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        text-align: center;
    }

    #icon{
        color: white;
        font-size: 1.5em;
        background-color: #284387;
        border-radius: 100%;
        padding: 0.4rem 0.6rem;
        box-shadow: 0 0px 12px #807e85;
        display: inline-block;
        margin: 0;
    }

    #text{
        background-color: white;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0.4rem 0.5rem;
        color: #A3A0A9;
        font-size: 1rem; 
        box-shadow: 0 4px 9px #807e85;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0.5rem 0;
        width: 250px;
    }
</style>