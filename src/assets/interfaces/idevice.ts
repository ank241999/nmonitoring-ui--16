import { ILane } from './ilane';

export interface IDevice {
    id?: number;
    creationTimestamp?: string;
    updateTimestamp?: string;
    name?: string;
    macAddress?: string;
    soundAddress?: string;
    lightingAddress?: string;
    leftProximitySensorAddress?: string;
    rightProximitySensorAddress?: string;
    physicalMark?: string;
    side?: string;
    status?: boolean;
    spathFlag?: boolean;
    tabletId?: string;
    // lane?: ILane;
    laneId?: number;
    laneName?: string;
    entranceId?: number;
    entranceName?: string;
    ipAddress?: string;
}

export interface IAssignSerialNo {
    location: string;
    serialNumber: string;
}

export class AssignSerialNo {
    constructor(public location: string,
        public serialNumber: string) { }
}

export interface IDeviceLightConfigration {
    id: number;
    creationTimestamp: number;
    updateTimestamp: number;
    deviceId: number;
    location: string;
    serialNo: string;
    isActive: boolean;
}

export interface IDeviceLightConfigrationReq {
    deviceId: number;
    location: string;
    serialNo: string;
    isActive: boolean;
}

export class DeviceLightConfigrationReq {
    constructor(
        public deviceId: number,
        public location: string,
        public serialNo: string,
        public isActive: boolean) { }
}
