import React from "react";
import { ComposableMap, Geographies, Geography,ZoomableGroup, Marker } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson";

const MapChart = (data) =>{
    const handleClick = geo =>()=>{
        // console.log(results);
        console.log(data.currentCountry);
    }

    if (!data) return
    else{
    return(
        <ComposableMap
            projectionConfig={{
                scale: 600,
                    }}
            width={800}
            height={1500}
            style={{ width: "75%", height: "auto" }} 
        >
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                    <Geography 
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#FFFFFF"
                    style={{
                        default: {
                        outline:"none",
                        fill: data.results.includes(geo.properties.NAME) ? "#98FB98" :  (data.currentCountry == geo.properties.NAME)? "#F5761A" : "#EEE",
                        },
                        hover: {
                        outline:"none",
                        fill: "#F53",
                        },
                        pressed: {
                        outline:"none",
                        fill: "#E42",
                        },
                    }}
                    onClick={handleClick(geo.properties.NAME)}
                    />
                    ))
                }
            </Geographies>
        </ComposableMap>
    )
            }
}

export default MapChart;