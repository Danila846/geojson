import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import "./Map.css"
import mnDistricts from './GeoJSON.geojson'


export default function MapComponent() {

	mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWxhODQ2IiwiYSI6ImNrem1vZjlpaTJxdzUybm8wd3VjNDlpbmMifQ.1HmKdO8hLtsQLxaa0q6y8w';

	const mapContainer = useRef(null);
	// const map = useRef(null);
	const [lng, setLng] = useState(92.90349594950831);
	const [lat, setLat] = useState(56.05105300330894);
	const [zoom, setZoom] = useState(13);

	useEffect(() => {
		// if (map.current) return; // initialize map only once
		let map = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.once("load", function () {

			map.addSource('district-source', {
				'type': 'geojson',
				'data': mnDistricts
			});

			map.addLayer({
				'id': 'district-layer',
				'type': 'fill',
				'source': 'district-source',
				"title": "Planet",
				'layout': {},
				'paint': {
					'fill-color': '#0080ff', // blue color fill
					'fill-opacity': 0.3,
				}
			});
			map.addLayer({
				'id': 'outline',
				'type': 'line',
				'source': 'district-source',
				'layout': {},
				'paint': {
					'line-color': '#0000ff',
					'line-width': 2
				}
			});
			map.on('click', 'district-layer', (e) => {
				new mapboxgl.Popup()
					.setLngLat(e.lngLat)
					.setHTML(e.features[0].properties.title)
					.addTo(map);
			});
			// Change the cursor to a pointer when
			// the mouse is over the states layer.
			map.on('mouseenter', 'district-layer', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			// Change the cursor back to a pointer
			// when it leaves the states layer.
			map.on('mouseleave', 'district-layer', () => {
				map.getCanvas().style.cursor = '';
			})
		});

	});


	return (
		<div>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}