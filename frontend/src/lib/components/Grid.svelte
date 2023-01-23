
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import Search from "./Search.svelte";
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount } from 'svelte';

    let width; let height;
    const tsneRatio = 0.002;

    let displaySaved: boolean = false;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    const documentIds = new Set();

    let boundingBox;

    async function getData(){
        console.log(boundingBox[0][0] + ", " + boundingBox[0][1] + " | " + boundingBox[1][0] + ", " + boundingBox[1][1])
        let {data, error} = await supabase
            .from('documents')
            .select()
            .gte("tsne_0", boundingBox[0][0]).lte("tsne_0", boundingBox[1][0])
            .gte("tsne_1", boundingBox[0][1]).lte("tsne_1", boundingBox[1][1]);

        data.forEach((data) => {
            if(!documentIds.has(data.filename)){
                documents.push(data);
                documentIds.add(data.filename);
                // console.log(data.tsne_0 + "," + data.tsne_1 + " " + data.title);
            }
        });

        

        documents = documents;
    }

	onMount(async () => {

        boundingBox = [[0, 0], [width * tsneRatio, height * tsneRatio]];

        getData();
	});


    function getX(document: Document){
        return document.tsne_0 / tsneRatio;
    }

    function getY(document: Document){
        return document.tsne_1 / tsneRatio;
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

        let viewBoxString = `${newViewBox.x} ${newViewBox.y} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onPointerUp(event) {
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
        selectedDocument = document;
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
        on:click|self={() => {selectedDocument = null;}}
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