import { Stack } from 'expo-router';
import React, {type ReactElement, useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import {StationSelector} from "~/components/StationSelector";
import {api} from "~/utils/api";
import type {StationData} from "@acme/api/src/service/tides.types";

interface Props {
    navigation: any;
}

const Welcome: React.FC<Props> = ({ navigation }): ReactElement => {
    const [stations, setStations] = React.useState<StationData[]>();
    const { data } = api.data.allStations.useQuery();
    useEffect(() => {
        if(!stations) {
            // eslint-disable-next-line @typescript-eslint/require-await
            void (async () => {
                setStations(data);
            })();
        }
    }, [data]);

    return (
        <View className="justify-center items-center flex-1">
            <Stack.Screen options={{ title: "Welcome" }} />

            <Text>Configure</Text>
            <StationSelector stations={stations}/>

        </View>
    );
};

export default Welcome;