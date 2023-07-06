export type CSV = string;

export type StationData = {
  stationname: string;
  stationid: string;
  nwsli: string;
  stationlat: number;
  stationlon: number;
  hat: number;
  mhhw: number;
  msl: number;
  mllw: number;
  obs: number;
  tide: number;
  tidetype: string;
  ref: number;
  stat: number;
  maxval: number;
  maxtime: number;
}

export type StationDataFrame = {
  ts: string | number | Date;
  ss: number | null;
  ti: number | null;
  ob: number | null;
  tw: number | null;
  an: number | null;
} & {[key: string]: unknown};

export type ProductDataInput = {
  [K in keyof StationDataFrame]: StationDataFrame[K][];
} & Record<keyof StationDataFrame, unknown>