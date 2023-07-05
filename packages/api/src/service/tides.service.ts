import moment from "moment"
import type { CSV, ProductDataInput, StationData, StationDataFrame } from "./tides.types"

class StationDataService {
  private async fetchStationData(url: string, config: RequestInit): Promise<Response> {
    return await fetch(url, config);
  }

  public async getStations(): Promise<StationData[]> {
    const req = await this.fetchStationData("https://slosh.nws.noaa.gov/etsurge2.0/datafiles/master.csv", {
      "headers": {
        "accept": "*/*",
      },
      "method": "GET"
    });

    const csv = await req.text();
    return this.parseStations(csv);
  }

  public async getStationTideData(stationID: string): Promise<ProductDataInput> {
    const req = await this.fetchStationData("https://slosh.nws.noaa.gov/etsurge2.0/fixed/php/getData.php", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      "body": `st=${stationID}`,
      "method": "POST"
    });


    return await req.json() as ProductDataInput;
  }


  public createJSONProduct(stationName: string, stationId: string, input: ProductDataInput): string {
    const products: Partial<StationDataFrame>[] = [];
    for (let i = 480; i < input['ts'].length; i += 10) {
      const product: StationDataFrame = {} as StationDataFrame;
      const timestampFromData = input['ts'][i];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      product.ts = moment(timestampFromData, 'YYYYMMDDHHmm').format('MM/DD HH');
      ['ss', 'pred', 'obs', 'twl', 'anom'].forEach((key: string) => {

        const group = input[key];
        const value = typeof group !== 'undefined' ? group[i] : null;

        if(typeof value === "number") {
          product[key] = (value !== 9999) ? parseFloat(value.toFixed(1)) : null;
        }
      });
      products.push(product);
    }

    const output = {
      stationName,
      stationId,
      mdatum: 'Height in Feet MLLW',
      products
    };

    return JSON.stringify(output);
  }

  public parseStations(data: CSV): StationData[] {
    const rows = data.split('\n');
    const [headerRow, ...dataRows] = rows;
    const headers = headerRow?.split(',');

    return dataRows.map(row => {
      const cells = row.split(',');
      const stationData: Partial<StationData> & Record<string, any> = {};

      headers?.forEach((header, index) => {
        const key = header.trim().toLowerCase().replace(/\s/g, '');
        stationData[key] = cells[index];
      });

      return stationData as StationData;
    });
  }
}

export default StationDataService;