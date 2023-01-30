
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import { onMount,beforeUpdate,afterUpdate } from 'svelte';
    import { rectCollide } from '../forces';
    import * as d3 from 'd3';

    let width; let height;
    const tsneRatio = 0.002;

    let documentPositions = [];

    let simulation; 

    async function getData(){
        for(let i = 0; i < 20; i++){
            let {data, error} = await supabase
                .from('documents')
                .select()
                .eq("main_topic", i);

            data.forEach((d) => {
                documentPositions.push({
                    "filename": d.filename,
                    "x": getX(d),
                    "y": getY(d), 
                    "width": d.width, 
                    "height": d.height
                });
            })

            console.log(documentPositions.length);
        }  
    }

	onMount(async () => {
        await getData();

        simulation = d3.forceSimulation(documentPositions)
            .force('collision', rectCollide())
            .stop();

        runSimulation();
	});

    async function doneTicking(){
        console.log("done");
        for(let i = 0; i < documentPositions.length; i++){
            console.log("uploading " + i);
            const { error } = await supabase
                .from('documents')
                .update({ x: documentPositions[i].x, y: documentPositions[i].y })
                .eq('filename', documentPositions[i].filename);
        }
        console.log("done inserting")
    }

    function getX(document: Document){
        return document.tsne_0 / tsneRatio;
    }

    function getY(document: Document){
        return document.tsne_1 / tsneRatio;
    }

    // Use d3 force simulation to position items 
    function runSimulation() {
        console.log("running simulation");
        for (var i = 0; i < 300; ++i) {
            console.log("tick");
            simulation.tick();
        }

        // var u = d3.select('#grid').select('svg')
        //     .selectAll('rect')
        //     .data(documentPositions)
        //     .join('rect')
        //     .attr('width', d => d.width)
        //     .attr('height', d => d.height)
        //     .attr('x', d => d.x - d.width / 2)
        //     .attr('y', d => d.y - d.height / 2);

        doneTicking();
    }

</script>
    
<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
/>

<div id = "grid" >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <svg>
    </svg>
</div>

<style>
    #grid{
        width: 100vw;
        height: 100vh;
        user-select: none; 
    }

    svg{
        width: 100%;
        height: 100%;
    }
</style>