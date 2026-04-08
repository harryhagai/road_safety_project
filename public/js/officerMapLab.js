document.addEventListener('DOMContentLoaded', function () {
    const mapRoot = document.getElementById('roadSegmentMapLab');

    if (!mapRoot || !mapRoot.mapApi) {
        return;
    }

    const defaultConfig = JSON.parse(mapRoot.dataset.mapConfig || '{}');
    mapRoot.mapApi.selectPoint(
        defaultConfig.defaultCenter.lat,
        defaultConfig.defaultCenter.lng
    );
});
