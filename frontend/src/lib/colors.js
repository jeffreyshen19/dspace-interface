const NUM_COLORS = 20;

function selectColor(colorNum, opacity){
    return "hsl(" + (colorNum * (360 / NUM_COLORS) % 360) + ",50%,40%," + opacity + ")";
}

export function getDocumentColor(document, opacity){
    return selectColor(document.main_topic, opacity);
}