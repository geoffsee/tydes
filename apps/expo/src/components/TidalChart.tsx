import React from 'react';
import {Dimensions} from 'react-native';
import {
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryTheme,
    VictoryVoronoiContainer
} from 'victory-native';
import type {StationDataFrame} from "@acme/api";

const TidalChart = ({data}: { data: StationDataFrame[] }) => {
    let {width, height} = Dimensions.get('window');

    const voronoiTimestamp = (ts: number) => {
        return `${new Date(ts).toLocaleString()}`;
    };

    const tickTimestamp = (ts: number) => {
        let options = {
            hour: '2-digit',
            // minute: '2-digit',
            hour12: true
        };
        const date = new Date(ts);

        return `${date.toLocaleTimeString('en-US', options).replace(' ', '')} \n ${date.getMonth() + 1}/${date.getDate()}`;
    };
    let oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let currentTime = new Date(Date.now());
    let minTimestamp = oneDayAgo;
    let maxTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000);
    let minValue = 0;
    let maxValue = 8;
    return (
        <VictoryChart
            style={{parent: {background: 'transparent'}}}
            standalone={true}
            width={width}
            height={height - 100}
            domain={{
                x: [minTimestamp, maxTimestamp],
            }}
            theme={VictoryTheme.material}
            containerComponent={
                <VictoryVoronoiContainer
                    labels={({datum}) => {
                        const ts = voronoiTimestamp(datum.ts);
                        return `${ts}, \n Forecasted: ${datum.pred} ft`
                    }}
                />
            }
        >
            <VictoryAxis
                theme={VictoryTheme.material}
                style={{axisLabel: { fill: 'white'}, axis: {stroke: "white"}}}
                label={"Date/Time"}
                labelComponent={<VictoryLabel/>}
                axisLabelComponent={<VictoryLabel labelPlacement={'parallel'} text={"Date/Time"} dy={31}/>}
                tickCount={10}
                tickFormat={(x) => {
                    return tickTimestamp(x);
                }}
            />
            <VictoryAxis
                dependentAxis
                label={"Water Level (ft)"}
                style={{axisLabel: {padding: 40, fill: 'white'}, axis: {stroke: "white"}}}
            />


            {/* VictoryLine for ss */}
            <VictoryLine
                style={{
                    data: {stroke: "cyan"},
                    parent: {border: "transparent"}
                }}
                // labels={({ datum }) => `Storm Surge: ${datum.ss}`}
                data={data}
                x="ts"
                //*Storm Surge (ETSS)*/
                y="ss"
            />

            <VictoryLine
                style={{
                    data: {stroke: "blue"},
                    parent: {border: "transparent"}
                }}
                // labels={({ datum }) => `Storm Surge: ${datum.tide}`}
                data={data}
                x="ts"
                //*Astronomical Tide*/
                y="twl"
            />

            <VictoryLine
                style={{
                    data: {stroke: "yellow"},
                    parent: {border: "transparent"}
                }}
                data={data}
                // labels={({ datum }) => `Storm Surge: ${datum.pred}`}

                //*Forecasted Water levels*/
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
                //*Observed Water levels*/
                y="obs"
            />

            {/* VictoryLine for current time */}
            <VictoryLine
                data={[ { x: currentTime, y: minValue}, { x: currentTime, y: maxValue} ]}
                style={{ data: { stroke: "white", strokeWidth: 2 } }}
            />

        </VictoryChart>
    )
};

export default TidalChart;