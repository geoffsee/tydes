import React, {useEffect, useState} from "react"
import {ActivityIndicator, Text, View, Button} from "react-native"
import * as Location from 'expo-location';
import {useRouter} from "expo-router";
import * as turf from "@turf/turf";
import type {StationData} from "@acme/api";
// Define the interface for station

type Station = StationData;
// Define the interface for component's props
interface NearestStationProps {
    stations?: Station[];
}

// Component implementation
export const StationSelector: React.FC<NearestStationProps> = ({stations}) => {
    const router = useRouter();
    const [nearestStation, setNearestStation] = useState<Station | null>(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject>();
    useEffect(() => {
        void (async () => {

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            setLocation(await Location.getCurrentPositionAsync());
        })();
    }, []);


    type ReduceObject = { minDistance: number, station: Station | null };


    const findNearestStation = () => {
        setLoading(true);
        const lat: number = location?.coords.latitude ?? 0;
        const lon: number = location?.coords.longitude ?? 0;

        const userLocation = [lat, lon];

        let nearestObj: ReduceObject | null = null;

        if (stations) {
            nearestObj = stations.reduce((prev: ReduceObject, station: Station) => {
                if(station.stationlon === undefined || station.stationlat === undefined) {
                    return prev;
                }
                try {
                    const stationLocation = [station.stationlat, station.stationlon];

                    const from = turf.point(userLocation);
                    const to = turf.point(stationLocation);

                    const distance = turf.distance(from, to, {units: 'miles'});

                    if (distance < prev.minDistance) {
                        return { minDistance: distance, station };
                    }

                } catch (e) {
                    console.log(e);
                }
                return prev;
            }, {
                minDistance: Number.MAX_SAFE_INTEGER,
                station: null
            });
        }

        if (nearestObj) {
            setNearestStation(nearestObj.station);
        }
        setLoading(false);
        return nearestObj?.station;
    };

    if (loading) {
        return <ActivityIndicator size="large"/>;
    }

    return (
        <View className="flex items-center justify-center">
            <Button
                title="Find nearest station"
                onPress={() => {
                    const station = findNearestStation()
                    router.push(`/station/${station?.stationid}`)
                }}
            />
            {
            nearestStation && <Text>Nearest station is {nearestStation.stationname}</Text>
            }
        </View>
    );
};