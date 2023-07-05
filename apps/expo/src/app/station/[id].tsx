import { SafeAreaView, Text, View } from "react-native";
import { SplashScreen, Stack, usePathname } from "expo-router";

import { api } from "~/utils/api";

function Station() {
    const pathname = usePathname();
    const id = pathname.split("/")[2];
    if (!id || typeof id !== "string") throw new Error("unreachable");
    const { data } = api.data.getTideDataByStationID.useQuery({ stationID: id  });

    if (!data) return <SplashScreen />;

    const stationData: any = JSON.parse(data);

    return (
        <SafeAreaView className="bg-[#1F104A]">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            <Stack.Screen options={{ title: `${stationData.stationName}` }} />
            <View className="h-full w-full p-4">
                <Text className="py-2 text-3xl font-bold text-white">{id}</Text>
                <Text className="py-4 text-white">{id}</Text>
            </View>
        </SafeAreaView>
    );
}

export default Station;