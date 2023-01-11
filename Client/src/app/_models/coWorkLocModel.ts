import { Time } from "ngx-bootstrap/timepicker/timepicker.models";

export class CoWorkLocModel {
    id: number;
    locationName: string;
    locationAddress: string;
    starTime: any;
    endTime: any;
    workingTime: string;
    locationType: string;
    wifiSsid: string;
    lat: string;
    lon: String;
    macAddressWifi: String;
    wifiName:string;
    constructor() {
        // Set default start time is 1am UTC
        this.starTime = 3200000;
        // Set default end time is 2 am UTC
        this.endTime = 7200000;
    }
}
