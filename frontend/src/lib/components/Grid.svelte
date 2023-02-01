
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import ZoomControl from './ZoomControl.svelte';
    import Search from "./Search.svelte";
    import Minimap from './Minimap.svelte';
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount, afterUpdate } from 'svelte';
    import Fa from 'svelte-fa';
    import { faCircleNotch, faY } from '@fortawesome/free-solid-svg-icons';
    import DirectionIndicator from './DirectionIndicator.svelte';
    import { select } from 'd3';

    let width; let height;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    let displaySaved = false;
    let resultsVisible = false;
    let showDirectionIndicator = false;
    let directionIndicatorAngle = 0;
    let directionIndicatorTitle;

    let boundingBox;
    let loading;
    let loadedBox; 

    let isPointerDown: boolean = false;
    let pointerOrigin;
    let viewBox;
    let newViewBox;

    let zoom;
    let zoomFactor = 0.9;
    let minZoom = 0.25;
    let maxZoom = 1.5;

    let moved = false;

    async function getData(){
        let widthPadding = 2 * width;
        let heightPadding = 2 * height;

        loading = true;
        loadedBox = [[boundingBox[0][0] - widthPadding, boundingBox[0][1] - heightPadding], [ boundingBox[1][0] + widthPadding, boundingBox[1][1] + heightPadding]];

        let {data, error} = await supabase
            .from('documents')
            .select()
            .gte("x", loadedBox[0][0]).lte("x", loadedBox[1][0])
            .gte("y", loadedBox[0][1]).lte("y", loadedBox[1][1]);

        documents = data;
        loading = false;
    }

    function setURLParams(){
        var url = new URL(window.location.href);
        url.searchParams.set('x', boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2);
        url.searchParams.set('y', boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2);
        url.searchParams.set('z', zoom);
        window.history.replaceState(null, "", url.toString())
    }

    
    function transportTo(x: number, y: number, z?: number){
        boundingBox = [[x - width / 2, y - height / 2], [x + width / 2, y + height / 2]];

        pointerOrigin = {
            x: boundingBox[0][0], 
            y: boundingBox[0][1]
        };
        viewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1],
            width: width,
            height: height
        };
        newViewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1]
        };

        zoom = z || 1;
        scale();

        setViewBoxString();
        if(!loadedBox || needToReload()) getData();

        setURLParams();
    }

    function onResize(){
        let centerX = boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2;
        let centerY = boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2;
        transportTo(centerX, centerY, zoom);
    }

	onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        let centerX = parseFloat(urlParams.get("x")) || 0;
        let centerY = parseFloat(urlParams.get("y")) || 0;
        zoom = Math.max(minZoom, Math.min(parseFloat(urlParams.get("z")) || 1, maxZoom));
        
        transportTo(centerX, centerY, zoom);

        window.addEventListener('resize', onResize);
		
		return () => {
			window.removeEventListener('resize', onResize);
		}
	});

    // Handle panning of SVG 

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

    function scale(){
        let cx = viewBox.x + viewBox.width / 2;
        let cy = viewBox.y + viewBox.height / 2;

        let newWidth = width / zoom;
        let newHeight = height / zoom;

        viewBox.x = cx - newWidth / 2;
        viewBox.y = cy - newHeight / 2;
        viewBox.width = newWidth;
        viewBox.height = newHeight; 

        boundingBox[0][0] = viewBox.x;
        boundingBox[0][1] = viewBox.y;
        boundingBox[1][0] = (viewBox.width + viewBox.x);
        boundingBox[1][1] = (viewBox.height + viewBox.y);
    }

    function zoomOut(){
        zoom = Math.max(zoom * zoomFactor, minZoom);
        scale();
        setURLParams();
        console.log("zooming out " + zoom);
        setViewBoxString();
        if(needToReload()) getData();
    }

    function zoomIn(){
        zoom = Math.min(zoom / zoomFactor, maxZoom);
        console.log("zooming in " + zoom);
        scale();
        setURLParams();
        setViewBoxString();
        if(needToReload()) getData();
    }

    function setViewBoxString(){
        let viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onKeyDown(event){
        const speed = 20;

        switch(event.key.toLowerCase()){
            case "arrowleft": 
                viewBox.x -= speed;
                break;
            case "arrowright": 
                viewBox.x += speed;
                break;
            case "arrowup": 
                viewBox.y -= speed;
                break;
            case "arrowdown": 
                viewBox.y += speed;
                break;
            case "escape":
                selectedDocument = null; 
                displaySaved = false; 
                resultsVisible = false; 
                showDirectionIndicator = false;
                break;
        }

        setViewBoxString();
        if(needToReload()) getData();
    }

    function onPointerMove (event) {
        if (!isPointerDown) return; 

        let pointerPosition = getPointFromEvent(event);

        newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x) / zoom;
        newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y) / zoom;

        let dist = Math.pow(pointerPosition.x - pointerOrigin.x, 2) + Math.pow(pointerPosition.y - pointerOrigin.y, 2);

        if(dist > 10) moved = true;

        let viewBoxString = `${newViewBox.x} ${newViewBox.y} ${viewBox.width} ${viewBox.height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function needToReload(){
        return boundingBox[0][0] < loadedBox[0][0] + 300 || boundingBox[0][1] < loadedBox[0][1] + 300 || boundingBox[1][0] > loadedBox[1][0] - 300 || boundingBox[1][1] > loadedBox[1][1] - 300;
    }

    function onPointerUp(event) {
        if(!isPointerDown) return;
        isPointerDown = false;

        // Update viewbox
        viewBox.x = newViewBox.x;
        viewBox.y = newViewBox.y;

        boundingBox[0][0] = viewBox.x;
        boundingBox[0][1] = viewBox.y;
        boundingBox[1][0] = (viewBox.width + viewBox.x);
        boundingBox[1][1] = (viewBox.height + viewBox.y);

        // Update URL params 
        setURLParams();

        // Reload data, if necessary 
        if(needToReload()) getData();
        
        
    }

    function handleDocumentClick(document){
        if(!moved) selectedDocument = (selectedDocument == document) ? null : document;
        moved = false;
        resultsVisible = false;
    }

    function hoverOnDocument(document){
        // If document is outside bounding box, show direction indicator
        if(document.x < boundingBox[0][0] || document.y < boundingBox[0][1] || document.x > boundingBox[1][0] || document.y > boundingBox[1][1]){
            showDirectionIndicator = true;
            let cx = viewBox.x + viewBox.width / 2;
            let cy = viewBox.y + viewBox.height / 2;
            directionIndicatorAngle = Math.atan2(document.x - cx, cy - document.y);
            directionIndicatorTitle = document.title;
        }
    }

    function hoverOffDocument(){
        showDirectionIndicator = false;
    }

</script>
    
<Search {hoverOffDocument} {hoverOnDocument}  {transportTo} bind:selectedDocument={selectedDocument} bind:resultsVisible={resultsVisible}/>
<ZoomControl {zoomIn} {zoomOut} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<BagButton handleClick={() => {displaySaved = !displaySaved}} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo  {hoverOffDocument} {hoverOnDocument} {transportTo} {displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>
<Minimap {boundingBox} {transportTo} {zoom}/>
<DirectionIndicator  title={directionIndicatorTitle} angle={directionIndicatorAngle} {width} {height} {showDirectionIndicator}/>

<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
    on:keydown={onKeyDown}
/>

{#if loading}
    <div id = "overlay"></div>

    <span id = "loading">
        <Fa icon={faCircleNotch} size="3x" spin />
    </span>
{/if}

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
        on:click|self={() => {if(!moved) selectedDocument = null; moved = false; resultsVisible = false; }}
    >
        {#each documents as document}
            <foreignObject on:click={() => handleDocumentClick(document)} x="{document.x}" y="{document.y}" width="1" height="1">
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

    #overlay{
        z-index: 99;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(181, 181, 181, 0.3);
        backdrop-filter: blur(1px);
    }

    #loading{
        position: absolute;
        z-index: 102;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    svg{
        width: 100%;
        height: 100%;
    }

    foreignObject{
        overflow: visible;
    }
</style>