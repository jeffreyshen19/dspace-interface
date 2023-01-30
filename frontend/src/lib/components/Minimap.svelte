<script>
    import {savedItems} from '../store.js';
    import Fa from 'svelte-fa';
    import { faStar } from '@fortawesome/free-solid-svg-icons';

    const min_x = -60000; const max_x = 60000;
    const min_y = -60000; const max_y = 60000;

    const width = 200;
    const height = 130;

    export let boundingBox;

    function getScalingFactorX(){
        return width / (max_x - min_x)
    }

    function getScalingFactorY(){
        return height / (max_y - min_y)
    }

</script>

<div id = "minimap" style:width="{width}px" style:height="{height}px">
    {#if boundingBox}
        <svg>
            {#each Object.keys($savedItems) as filename}
                <foreignObject
                    x={getScalingFactorX() * $savedItems[filename].x + width / 2 - 4}
                    y={getScalingFactorY() * $savedItems[filename].y + height / 2 - 4}
                    width=5
                    height=5
                >
                    <div><Fa icon={faStar} /></div>   
                </foreignObject>
            {/each}

            <rect
                width={(boundingBox[1][0] - boundingBox[0][0]) * getScalingFactorX()}
                height={(boundingBox[1][1] - boundingBox[0][1]) * getScalingFactorY()}
                x={getScalingFactorX() * boundingBox[0][0] + width / 2}
                y={getScalingFactorY() * boundingBox[0][1] + height / 2}
            ></rect>
        </svg>
    {/if} 

    
</div>

<style>
    #minimap{
        position: absolute;
        bottom: 1.2rem;
        left: 1.5rem;
        background-color: white;
        /* border: 4px solid #A3A0A9; */
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 0 2px 9px #A3A0A9;
        z-index: 100;
    }

    svg{
        width: 100%;
        height: 100%;
    }

    foreignObject{
        overflow: visible;
    }

    foreignObject div{
        font-size: 8px;
        color: #f7ca18;
    }
</style>