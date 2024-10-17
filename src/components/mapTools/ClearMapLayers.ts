export function clearMapLayers() {
    //@ts-ignore
    const mapLayers = window.cesiumViewer.imageryLayers._layers.filter(item => {
        return item._layerIndex;
    });


    if (mapLayers.length <= 3) {
        return;
    } else {
        let deleteLayers = mapLayers.slice(3)

        for (const layer of deleteLayers) {
            window.cesiumViewer.imageryLayers.remove(layer);
            // console.log("调用了删除")
        }
    }

}
