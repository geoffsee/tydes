import React from 'react';
import {VictoryLine, VictoryChart, VictoryAxis} from 'victory-native';
import type {StationDataFrame} from "@acme/api";

const TidalChart = ({data}: { data: StationDataFrame[] }) => {
    return (
        <VictoryChart
            style={{parent: {background: "transparent"}}}
        >
            <VictoryAxis
                style={{
                    axis: {stroke: "white"},
                    ticks: {stroke: "white", size: 4},
                    tickLabels: {fontSize: 15, padding: 5, fill: "white"}
                }}
                tickFormat={(x) => {
                    console.log(x);
                    const dayTime = x.split(" ");
                    const date = new Date(dayTime[0]);
                    date.setHours(dayTime[1]);
                    return `${date.getHours()}:${date.getMinutes()}`;
                }}
            />
            <VictoryAxis dependentAxis/>

            {/* VictoryLine for ss */}
            <VictoryLine
                style={{
                    data: {stroke: "cyan"},
                    parent: {border: "transparent"}
                }}
                data={data}
                x="ts"
                y="ss"
            />

            <VictoryLine
                style={{
                    data: {stroke: "blue"},
                    parent: {border: "transparent"}
                }}
                data={data}
                x="ts"
                y="twl"
            />

            <VictoryLine
                style={{
                    data: {stroke: "yellow"},
                    parent: {border: "transparent"}
                }}
                data={data}
                x="ts"
                y="pred"
            />

            <VictoryLine
                style={{
                    data: {stroke: "red"},
                    parent: {border: "transparent"}
                }}
                data={data}
                x="ts"
                y="obs"
            />

            {/* add more VictoryLine components for ob, tw, an here */}
        </VictoryChart>
    )
};

export default TidalChart;