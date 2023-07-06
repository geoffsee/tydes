import {Stack, useRouter} from 'expo-router';
import React, {Fragment, type ReactElement, useEffect} from 'react';
import {api} from "~/utils/api";
import type {StationData} from "@acme/api/src/service/tides.types";
import MapView, {Marker, type Region} from 'react-native-maps';
import * as Location from 'expo-location';

interface Props {
    navigation: any;
}

const Welcome: React.FC<Props> = ({navigation}): ReactElement => {
    const [stations, setStations] = React.useState<StationData[]>();
    const [region, setRegion] = React.useState<Region>();
    const {data} = api.data.allStations.useQuery();
    const router = useRouter();
    useEffect(() => {
        void (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    useEffect(() => {
        if (!stations) {
            // eslint-disable-next-line @typescript-eslint/require-await
            void (async () => {
                setStations(data);
            })();
        }
    }, [data]);

    return (
        <Fragment>
            <Stack.Screen options={{title: "Stations"}}/>
            <MapView
                style={{flex: 1}}
                initialRegion={region}
                showsMyLocationButton={true}
                showsUserLocation={true}
                followsUserLocation={true}
                zoomControlEnabled={true}
                loadingEnabled={true}
                maxZoomLevel={20}
            >
                {stations?.map((station, index) => (
                    <Marker
                        key={index}
                        coordinate={{latitude: station.stationlat, longitude: station.stationlon}}
                        title={station.stationname ?? "No name"}
                        onCalloutPress={() => router.push(`/station/${station.stationid}`)}
                    >
                    </Marker>
                ))}
            </MapView>
        </Fragment>
    );
};

export default Welcome;