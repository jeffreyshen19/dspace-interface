
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import Search from "./Search.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    import {rectCollide} from "../forces.js";

    let width; let height;
    const tsneRatio = 0.002;

    let displaySaved: boolean = false;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    let documentPositions = [];
    const documentIds = new Set();

    let boundingBox;
    let simulation; 
    let newPositions = [];

    let moved = false;

    async function getData(){
        let widthPadding = 2 * width * tsneRatio;
        let heightPadding = 2 * height * tsneRatio

        let {data, error} = await supabase
            .from('documents')
            .select()
            .gte("tsne_0", boundingBox[0][0] - widthPadding).lte("tsne_0", boundingBox[1][0] + widthPadding)
            .gte("tsne_1", boundingBox[0][1] - heightPadding).lte("tsne_1", boundingBox[1][1] + heightPadding);

        data.forEach((data) => {
            if(!documentIds.has(data.filename)){
                documents.push(data);
                newPositions.push({
                    "filename": data.filename,
                    "x": getX(data),
                    "y": getY(data)
                });
                documentIds.add(data.filename);
            }
        });

        documents = documents;
    }

    afterUpdate(() => {
        newPositions.forEach((d) => {
            let bbox = document.querySelector(".document[data-filename='" + d.filename + "']")?.getBoundingClientRect();

            d["width"] = bbox.width;
            d["height"] = bbox.height;

            documentPositions.push(d);
        })

        if(newPositions.length) {
            simulation = d3.forceSimulation(documentPositions)
                .force('collision', rectCollide())
                .on('tick', ticked);
        }

        newPositions = [];
        
    });
    
	onMount(async () => {

        boundingBox = [[0, 0], [width * tsneRatio, height * tsneRatio]];

        await getData();
	});

    function getX(document: Document){
        return document.tsne_0 / tsneRatio;
    }

    function getY(document: Document){
        return document.tsne_1 / tsneRatio;
    }

    // Use d3 force simulation to position items 
    function ticked() {
        var u = d3.select('#grid').select('svg')
            .selectAll('foreignObject')
            // .selectAll('circle')
            .data(documentPositions)
            // .join('circle')
            // .join('foreignObject')
            .attr('x', d => d.x)
            .attr('y', d => d.y);
            // .attr('r', d => d.radius)
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y);
    }

    // Handle panning of SVG 
    let isPointerDown: boolean = false;
    let pointerOrigin = {
        x: 0, 
        y: 0
    };
    let viewBox = {
        x: 0,
        y: 0
    };

    let newViewBox = {
        x: 0,
        y: 0
    };

    function getPointFromEvent (event) {
        var point = {x: 0, y: 0};
        // If event is triggered by a touch event, we get the position of the first finger
        if (event.targetTouches) {
            point.x = event.targetTouches[0].clientX;
            point.y = event.targetTouches[0].clientY;
        } else {
            point.x = event.clientX;
            point.y = event.clientY;
        }
        
        return point;
    }

    function onPointerDown(event) {
        isPointerDown = true; 
        let pointerPosition = getPointFromEvent(event);
        pointerOrigin.x = pointerPosition.x;
        pointerOrigin.y = pointerPosition.y;
    }

    function onKeyDown(event){
        const speed = 20;

        switch(event.key.toLowerCase()){
            case "a":
            case "arrowleft": 
                viewBox.x -= speed;
                break;
            case "d":
            case "arrowright": 
                viewBox.x += speed;
                break;
            case "w":
            case "arrowup": 
                viewBox.y -= speed;
                break;
            case "s":
            case "arrowdown": 
                viewBox.y += speed;
                break;
        }

        let viewBoxString = `${viewBox.x} ${viewBox.y} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onPointerMove (event) {
        if (!isPointerDown) return; 

        let pointerPosition = getPointFromEvent(event);

        newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x);
        newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y);

        let dist = Math.pow(pointerPosition.x - pointerOrigin.x, 2) + Math.pow(pointerPosition.y - pointerOrigin.y, 2);

        if(dist > 10) moved = true;

        let viewBoxString = `${newViewBox.x} ${newViewBox.y} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onPointerUp(event) {
        if(!isPointerDown) return;
        isPointerDown = false;

        viewBox.x = newViewBox.x;
        viewBox.y = newViewBox.y;

        boundingBox[0][0] = viewBox.x * tsneRatio;
        boundingBox[0][1] = viewBox.y * tsneRatio;
        boundingBox[1][0] = (width + viewBox.x) * tsneRatio;
        boundingBox[1][1] = (height + viewBox.x) * tsneRatio;

        getData();
    }

    function handleDocumentClick(document){
        if(!moved) selectedDocument = (selectedDocument == document) ? null : document;
        moved = false;
    }

</script>
    
<Search/>
<BagButton handleClick={() => {displaySaved = !displaySaved}} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo {displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>

<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
    on:keydown={onKeyDown}
/>

<div id = "grid" >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <svg 
        on:mousedown={onPointerDown}
        on:mouseup|stopPropagation={onPointerUp}
        on:mouseleave|stopPropagation={onPointerUp}
        on:mousemove={onPointerMove}
        on:touchstart={onPointerDown}
        on:touchend={onPointerUp}
        on:touchmove={onPointerMove}
        on:click|self={() => {moved = false; selectedDocument = null;}}
    >
        {#each documents as document}
            <foreignObject on:click={() => handleDocumentClick(document)} x="{getX(document)}" y="{getY(document)}" width="1" height="1">
                <DocumentBox {document}/>
            </foreignObject>
        {/each}
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

    foreignObject{
        overflow: visible;
    }
</style>