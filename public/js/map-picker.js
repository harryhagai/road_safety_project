(function () {
    function normalizePayload(lat, lng, locationName) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lng, lat],
            },
            properties: {
                location_name: locationName || null,
            },
        };
    }

    function bindMap(root) {
        const config = JSON.parse(root.dataset.mapConfig || '{}');
        const shell = root.closest('[data-map-shell]');
        const coordinatesLabel = shell?.querySelector('[data-map-coordinates]');
        const recenterButton = shell?.querySelector('[data-map-recenter]');

        const map = L.map(root).setView(
            [config.defaultCenter.lat, config.defaultCenter.lng],
            config.defaultZoom
        );

        L.tileLayer(config.tiles.url, {
            minZoom: config.minZoom,
            maxZoom: config.maxZoom,
            attribution: config.tiles.attribution,
        }).addTo(map);

        let marker = null;

        function updateCoordinateText(lat, lng) {
            if (!coordinatesLabel) {
                return;
            }

            coordinatesLabel.textContent = `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
        }

        async function resolveLocation(lat, lng) {
            const response = await fetch(
                `${config.reverseGeocodeUrl}?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to reverse geocode the selected point.');
            }

            return response.json();
        }

        async function handleSelection(lat, lng) {
            if (!marker) {
                marker = L.marker([lat, lng]).addTo(map);
            } else {
                marker.setLatLng([lat, lng]);
            }

            updateCoordinateText(lat, lng);

            const locationTarget = document.getElementById('mapResolvedLocation');
            const payloadTarget = document.getElementById('mapPayloadPreview');

            if (locationTarget) {
                locationTarget.textContent = 'Resolving location name...';
            }

            const basePayload = normalizePayload(lat, lng, null);

            if (payloadTarget) {
                payloadTarget.textContent = JSON.stringify(basePayload, null, 2);
            }

            try {
                const result = await resolveLocation(lat, lng);
                const payload = normalizePayload(lat, lng, result.display_name || null);

                if (locationTarget) {
                    locationTarget.textContent = result.display_name || 'No address description returned.';
                }

                if (payloadTarget) {
                    payloadTarget.textContent = JSON.stringify(payload, null, 2);
                }
            } catch (error) {
                if (locationTarget) {
                    locationTarget.textContent = 'Location lookup failed. You can still continue with raw coordinates.';
                }
            }
        }

        map.on('click', function (event) {
            handleSelection(event.latlng.lat, event.latlng.lng);
        });

        recenterButton?.addEventListener('click', function () {
            map.setView([config.defaultCenter.lat, config.defaultCenter.lng], config.defaultZoom);
        });

        root.mapApi = {
            map,
            selectPoint: handleSelection,
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-map-root]').forEach(bindMap);
    });
})();
