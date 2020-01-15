import React, {useRef, useState,} from 'react';
import './App.css';
import GoogleMap from "google-map-react";
import useSupercluster from "use-supercluster";
import * as markersData from "./data/markers.json";

const Marker = ({children}) => children;

export default function App() {
    //map setup
    const mapRef = useRef();
    const [zoom, setZoom] = useState(14);
    const [bounds, setBounds] = useState(null);
    const points = markersData.markers.map(marker => ({
        type: "Feature",
        properties: { cluster: false, crimeId: marker.id, category: "location" },
        geometry: {
            type: "Point",
            coordinates: [
                marker.coordinatelng,
                marker.coordinatelat
            ]
        }
    }));
    //get clusters
    const {clusters} = useSupercluster({
        points,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    });


    return (<div style={{width: '100%', height: '100vh'}}>
            <GoogleMap bootstrapURLKeys={{key: 'AIzaSyCHNa7StS1PhUHypWtJfsNRSlZC-UsGNLg'}}
                       defaultCenter={{lat: 55.030991, lng: 82.920448}}
                       defaultZoom={14}
                       yesIWantToUseGoogleMapApiInternals
                       onGoogleApiLoaded={({map}) => {
                           mapRef.current = map;
                       }}
                       onChange={({zoom, bounds}) => {
                           setZoom(zoom);
                           setBounds([
                               bounds.nw.lng,
                               bounds.se.lat,
                               bounds.se.lng,
                               bounds.nw.lat
                           ]);
                       }}
            >
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {cluster: isCluster, point_count: pointCount} = cluster.properties;
                    if(isCluster){
                        return(
                          <Marker key={cluster.id}
                                  lat={latitude}
                                  lng={longitude}>
                              <div className="cluster" style={{
                                  width: `${10 + (pointCount / points.length) * 10}px`,
                                  height: `${10 + (pointCount / points.length) * 10}px`
                              }}>
                                  {pointCount}
                              </div>
                          </Marker>
                        );
                    }
                    return(
                        <Marker key={cluster.properties.markerId}
                                lat={latitude}
                                lng={longitude}>
                            <button className="mark">
                                <img src={require('./data/marker.svg')} alt={"location"} />
                            </button>
                        </Marker>
                    );
                })}
            </GoogleMap>
        </div>
    );
}
