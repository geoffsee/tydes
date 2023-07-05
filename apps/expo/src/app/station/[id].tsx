import { SafeAreaView, Text, View } from "react-native";
import { SplashScreen, Stack, usePathname } from "expo-router";

import { api } from "~/utils/api";
import TidalChart from "~/components/TidalChart";

function Station() {
    const pathname = usePathname();
    const id = pathname.split("/")[2];
    if (!id || typeof id !== "string") throw new Error("unreachable");
    const { data } = api.data.getTideDataByStationID.useQuery({ stationID: id  });

    if (!data) return <SplashScreen />;

    const tidesData: any = JSON.parse(data);

    console.log(tidesData.products);

    return (
        <SafeAreaView className="bg-[#1F104A]">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            <Stack.Screen options={{ title: `${tidesData.stationName}` }} />
            <View className="h-full w-full p-4">
                <TidalChart data={tidesData.products}/>
            </View>
        </SafeAreaView>
    );
}

export default Station;