@inject('mapConfigService', 'App\Services\MapConfigService')
@extends('layouts.app')

@section('title', 'RSRS - Road Safety Reporting System')

@section('content')
    @php
        $mapConfig = $mapConfigService->forFrontend();
    @endphp

    <link rel="stylesheet" href="{{ asset('css/rsrsFullMap.css') }}">

    <div class="rs-map-wrapper">
        <div class="rs-map-container">
            <!-- OpenStreetMap Canvas -->
            <x-map.canvas id="mainPublicMap" :config="$mapConfig" height="100vh" :show-toolbar="false" mode="viewer" />
        </div>
    </div>
@endsection

@push('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <link rel="stylesheet" href="{{ asset('css/rsrsMap.css') }}">
@endpush

@section('scripts')
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="{{ asset('js/rsrsMapPicker.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const mapEl = document.getElementById('mainPublicMap');
            let mapInterface = null;
            let watchId = null;

            // Wait for map initialization
            const mapWaitInterval = setInterval(() => {
                if (mapEl && mapEl.mapApi) {
                    mapInterface = mapEl.mapApi;
                    clearInterval(mapWaitInterval);
                    initializeTracking();
                }
            }, 150);

            function initializeTracking() {
                if (!navigator.geolocation) {
                    console.error("Geolocation not supported");
                    return;
                }

                function startWatching(highAccuracy) {
                    if (watchId !== null) navigator.geolocation.clearWatch(watchId);

                    watchId = navigator.geolocation.watchPosition(
                        function(pos) {
                            const { latitude, longitude } = pos.coords;
                            if (mapInterface) {
                                mapInterface.selectPoint(latitude, longitude);
                                mapInterface.map.setView([latitude, longitude], 16, { animate: true });
                            }
                        },
                        function(err) {
                            console.warn(`GPS Error (${err.code}): ${err.message}`);
                            // Fallback to low accuracy on timeout (3) or unavailable (2)
                            if (highAccuracy && (err.code === 3 || err.code === 2)) {
                                console.log("Retrying with standard accuracy...");
                                startWatching(false);
                            }
                        },
                        {
                            enableHighAccuracy: highAccuracy,
                            timeout: 20000,
                            maximumAge: 1000
                        }
                    );
                }

                startWatching(true);
            }
        });
    </script>
@endsection
