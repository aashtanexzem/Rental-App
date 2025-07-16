"use client"
import React, { useEffect, useRef } from 'react'
import mapboxgl from "mapbox-gl";
import { useAppSelector } from '@/state/redux';
import { useGetPropertiesQuery } from '@/state/api';
import { Property } from '@/types/prismaTypes';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef(null)
  const filters = useAppSelector((state) => state.global.filters);


  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  console.log("filters", filters)
  console.log("Loading:", isLoading, "Error:", isError, "Properties:", properties);



  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
  if (!properties || isLoading || isError) return;

  const map = new mapboxgl.Map({
    container: mapContainerRef.current!,
    style: "mapbox://styles/aasthanexzemcom/cmcvj4lm7002501sgb7u4by3v",
    center: filters.coordinates || [-74.5, 40],
    zoom: 9,
  });

  properties.forEach((property) => {
    const marker = createPropertyMarker(property, map);
    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute("fill", "#000000");
  });

  const resizeMap = () => setTimeout(() => map.resize(), 700);
  resizeMap();

  return () => map.remove();
}, [properties, isLoading, isError, filters.coordinates]);


  if (isLoading) return <>Loading Map...</>
  if (isError || !properties) return <div>Failed to Fetch properties.</div>



  return (
    <div style={{ height: "500px", width: "100%", position: "relative" }}>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
    </div>


  )
}

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};
export default Map
