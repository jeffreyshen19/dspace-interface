<script>
    import {savedItems} from '../store.js';
    import Fa from 'svelte-fa';
    import { faStar } from '@fortawesome/free-solid-svg-icons';
    import { supabase } from '../supabaseClient';
    import {getDocumentColor} from "../colors.js";

    const min_x = -60000; const max_x = 60000;
    const min_y = -60000; const max_y = 60000;

    let width = 200;
    let height = 130;

    let minimapData = [];

    export let minimapBox;
    export let transportTo;
    export let zoom;
    export let expanded;
    export let displaySaved;
    export let displayDocumentInfo;
    export let hovered;
    export let onPointerUp;
    export let onPointerMove;
    export let onPointerDown;

    function getScalingFactorX(){
        return width / (max_x - min_x);
    }

    function getScalingFactorY(){
        return height / (max_y - min_y);
    }

    function handleClick(e){
        let rect = e.target.getBoundingClientRect();
        let minimap_x = e.clientX - rect.left; 
        let minimap_y = e.clientY - rect.top; 
        
        let x = minimap_x / getScalingFactorX() + min_x;
        let y = minimap_y / getScalingFactorY() + min_y;
        transportTo(x, y, zoom);
    }

    function expand(){
        width = 400;
        height = 260;
        expanded = true;
    }

    function contract(){
        width = 200;
        height = 130;
        expanded = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div id = "minimap" 
     style:width="{width}px" 
     style:height="{height}px" 
     style:background-image="url('{hovered == null ? "minimap.png" : "minimaps/minimap-" + hovered + ".png"}')"
     on:mouseover={expand} 
     on:mouseout={contract} 
     class:two="{displaySaved && displayDocumentInfo}" 
     class:one="{(displaySaved || displayDocumentInfo) && !(displaySaved && displayDocumentInfo)}">
    {#if minimapBox}
        <svg on:click|self={handleClick} >
            <rect
                width={minimapBox.width * getScalingFactorX() * (expanded ? 2 : 1) + 4}
                height={minimapBox.height * getScalingFactorY() * (expanded ? 2 : 1) + 4}
                x={getScalingFactorX() * minimapBox.x + width / 2 - 2}
                y={getScalingFactorY() * minimapBox.y + height / 2 - 2}
                fill="rgba(80, 80, 80, 0.4)"
                stroke="rgba(0,0,0,0)"
                stroke-width=50
                on:mousedown={onPointerDown}
                on:mouseup|stopPropagation={onPointerUp}
                on:mouseleave|stopPropagation={onPointerUp}
                on:mousemove={(e) => onPointerMove(e, -1 / getScalingFactorX(), -1 / getScalingFactorY())}
                on:touchstart={onPointerDown}
                on:touchend={onPointerUp}
                on:touchmove={(e) => onPointerMove(e, -1 / getScalingFactorX(), -1 / getScalingFactorY())}
            ></rect>
        </svg>
    {/if} 

    
</div>

<style>
    #minimap{
        position: absolute;
        bottom: 1.2rem;
        right: 1.5rem;
        background-color: white;
        /* border: 4px solid #A3A0A9; */
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 0 2px 9px #A3A0A9;
        z-index: 100;
        background-size: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        transition: right 0.4s, width 0.4s, height 0.4s, background-image 0.2s;
        cursor: pointer;
    }

    #minimap.one{
        right: calc(1.5rem + 25vw);
    }

    #minimap.two{
        right: calc(1.5rem + 50vw);
    }


    svg{
        width: 100%;
        height: 100%;
    }

</style>