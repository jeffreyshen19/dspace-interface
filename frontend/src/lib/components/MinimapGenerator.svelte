<script>
    import { supabase } from '../supabaseClient';
    import {getDocumentColor} from "../colors.js";
    import {onMount } from 'svelte';

    const min_x = -60000; const max_x = 60000;
    const min_y = -60000; const max_y = 60000;

    const width = 200 * 2;
    const height = 130 * 2;

    let minimapData = [];

    function getScalingFactorX(){
        return width / (max_x - min_x)
    }

    function getScalingFactorY(){
        return height / (max_y - min_y)
    }

    async function getMinimapData(){
        const step = 40;
        for(let x = 0; x < width; x += step){
            for(let y = 0; y < height; y += step){
                const {data, error} = await supabase.from("documents")
                                                    .select("x,y,main_topic")
                                                    .gte("x", x / getScalingFactorX() + min_x).lte("x", (x + step) / getScalingFactorX() + min_x)
                                                    .gte("y", y / getScalingFactorY() + min_y).lte("y", (y + step) / getScalingFactorY() + min_y);
                minimapData = minimapData.concat(data);
                console.log(x, y);
            }
        }
        console.log(minimapData);
        minimapData = minimapData;

        let svg = document.querySelector("svg");
        let img = document.querySelector("img");
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let loader = new Image;                       

        loader.width  = canvas.width  = img.width;
        loader.height = canvas.height = img.height;
        loader.onload = function(){
            ctx.drawImage( loader, 0, 0, loader.width, loader.height );
            img.src = canvas.toDataURL();
        };
        var svgAsXML = (new XMLSerializer).serializeToString( svg );
        loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );

    }

    onMount(() => {
        getMinimapData();
    });

    

</script>

<div id = "minimap" style:width="{width}px" style:height="{height}px">
    <svg>
        {#each minimapData as point}
            <rect
                width=1
                height=1
                x={point.x * getScalingFactorX() + width / 2}
                y={point.y * getScalingFactorY() + height / 2}
                fill={getDocumentColor(point, 0.4)}
            ></rect>
        {/each}
    </svg>
</div>

<img style:width="{width}px" style:height="{height}px">

<style>
    #minimap{
        position: absolute;
        bottom: 1.2rem;
        left: 1.5rem;
        background-color: white;
    }

    svg{
        width: 100%;
        height: 100%;
    }
</style>