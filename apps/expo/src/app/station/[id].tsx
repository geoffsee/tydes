import { SafeAreaView, View, Text } from "react-native";
import { SplashScreen, Stack, usePathname } from "expo-router";
import InfoIcon from 'react-native-eva-icons/icons/Info';
import { api } from "~/utils/api";
import TidalChart from "~/components/TidalChart";
import {useState} from "react";

function Station() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const pathname = usePathname();
    const id = pathname.split("/")[2];
    if (!id || typeof id !== "string") throw new Error("unreachable");
    const { data } = api.data.getTideDataByStationID.useQuery({ stationID: id  });

    if (!data) return <SplashScreen />;

    const tidesData: any = JSON.parse(data);

    const legendData = [
        {color: 'cyan', description: 'Storm Surge (ETSS)'},
        {color: 'blue', description: 'Astronomical Tide'},
        {color: 'yellow', description: 'Forecasted Water levels'},
        {color: 'red', description: 'Observed Water levels'},
        {color: 'white', description: 'Current time'},
    ];

    return (
        <SafeAreaView className="bg-[#1F104A]">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            <Stack.Screen options={{ title: `${tidesData.stationName}` }} />
            <View className="h-full w-full p-4">
                <TidalChart data={tidesData.products}/>
            </View>
            <View className="absolute bottom-0 m-2">
                {showModal &&
                    <View className="m-2 p-2 bg-white rounded-lg">
                        {legendData.map((item, index) =>
                            <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{width: 20, height: 20, backgroundColor: item.color, marginRight: 10}}/>
                                <Text>{item.description}</Text>
                            </View>
                        )}
                    </View>
                }
             <InfoIcon  width={48} height={48} fill='#FFFDD0'
                        onPress={() => setShowModal(!showModal)}
                        onPressOut={() => setShowModal(false)} />
            </View>
             {/*<Ionicons name='md-checkmark-circle' size={32} color='green' />;*/}

        </SafeAreaView>
    );
}

export default Station;