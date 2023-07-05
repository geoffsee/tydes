import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const tidesRouter = createTRPCRouter({
  allStations: publicProcedure.query(({ ctx }) => {
    return ctx.tidesService.getStations();
  }),
  getTideDataByStationID: publicProcedure
    .input(z.object({ stationID: z.string() }))
    .query(async ({ ctx, input }) => {
      const stations = await ctx.tidesService.getStations();
      const stationName: string = stations.find(station => station.stationid === input.stationID)?.stationname ?? 'LOCAL STATION DATA';
      const rawData = await ctx.tidesService.getStationTideData(input.stationID);

      return ctx.tidesService.createJSONProduct(stationName, input.stationID, rawData);
    }),
});
