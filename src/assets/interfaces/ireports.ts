import { IRole } from './irole';

export interface IThreatActivity {
    id?: number;
    noThreatConfig?: string;
    noObjects?: boolean;
    threatHandgun?: string;
    threatRifle?: string;
    threatPipeBomb?: string;
    threatKnife?: string;
    threatThreat?: string;
    anomaly?: string;
    genericAnomaly?: string;
    nonThreatCellphone?: string;
    nonThreatKeys?: string;
    threatStatus?: string;
    creationTimestamp?: number;
    updateTimestamp?: number;
}

export interface IWeaponDetected {
    handgun?: number;
    rifle?: number;
    pipeBomb?: number;
    anomaly?: number;
    cellphone?: number;
    knife?: number;
    threat?: number;
    keys?: number;
    threatDate?: number;
    threatPosition?: string;
}

export interface IAnalyticReport {
    ifCorrect?: boolean;
    totalCorrect?: number;
    totalIncorrect?: number;
    threatTypes?: number;
    totalThreat?: number;
    totalAnomaly?: number;
    totalNoThreat?: number;
    weapons?: number;
    totalHandgun?: number;
    totalPipeBomb?: number;
    totalRifle?: number;
    totalKnife?: number;
    totalThreatThreat?: number;
    totalCellphone?: number;
    totalKeys?: number;
    locations?: number;
    upperFront?: number;
    lowerFront?: number;
    upperBack?: number;
    lowerBack?: number;
    rightHipFrontBack?: number;
    leftHipFrontBack?: number;
    rightArmFrontBack?: number;
    leftArmFrontBack?: number;
    rightUpperLegFrontBack?: number;
    rightLowerLegFrontBack?: number;
    leftUpperLegFrontBack?: number;
    leftLowerLegFrontBack?: number;
    rightHipFrontFront?: number;
    leftHipFrontFront?: number;
    rightArmFrontFront?: number;
    leftArmFrontFront?: number;
    rightUpperLegFrontFront?: number;
    rightLowerLegFrontFront?: number;
    leftUpperLegFrontFront?: number;
    leftLowerLegFrontFront?: number;
}

export interface IThreatLogReport {
    threatTime?: number;
    guardName?: string;
    configWeaponType?: string;
    configThreatLocation?: string;
    configThreatType?: string;
    logWeaponType?: string;
    logThreatLocation?: string;
    logThreatType?: string;
    deviceName?: string;
    gateName?: string;
    laneName?: string;
    creationDate?: string;
    updateDate?: string;
    testLogId?: number;
    threatConfigId?: number;
    actualResult?: boolean;
    deviceMacAddress?: string;
    side?: string;
    note?: string;
    totalRecord?: string;
    maxTotalRecord?: string;
}

export interface IThroughput {
    date?: number;
    hour?: number;
    total?: number;
    totalpersons?: number;
}

export interface IPersonSpecific {
    date?: number;
    devices?: string;
    lane?: string;
    gate?: string;
    objectids?: string;
    totalAlarmCount?: number;
    alarmPosition?: string;
    guardName?: string;
    email?: string
}

export interface IThroughputFilter {
    date?: number;
    timeInterval?: number;
    total?: number;
    totalThreats?: number;
    totalNoObject?: number;
}

export interface IPersonScannedDetails {
    objectids?: string;
    total_threat?: number;
    total_anomaly?: number;
    total_non_threat?: number;
    total_noobject?: number;
    total?: number;
}
export interface IScanCount {
    guardName?: string;
    email?: string;
    totalPersonScanned?: number;
    totalSuspectedPerson?: number;
    totalAlarmsCount?: number;
}
export interface IAlarmCount {
    date?: number;
    time?: number;
    objectids?: number;
    totalAlarmsCount?: number;
    alarmPosition?: string;    
}
export interface IScanCountDetails {
    dateTime?: number;
    guardName?: string;
    email?: string;
    objectids?: string;
    devices?: string;
    lane?: string;
    gate?: string;
    totalAlarmsCount?: number;
}
export interface IOperatorAction {
    objectids?: string;
    dateTime?: number;
    guardName?: string;
    email?: string;
    devices?: string;
    lane?: string;
    gate?: string;
    clearTime?: number;
    alarmPosition?: string;
}
export interface IOperatorInfo {
    guardName?: string;
    id?: string;
    loginTime?: number;
    logoutTime?: number;
}
export interface IdeviceInfo {
    guardName?: string;
    email?: string;
    gateName?: string;
    laneName?: number;
    deviceName?: string;
    totalPersonScanned?: number;
    totalSuspectedPerson?: number;
    totalAlarmsCount?: number;
}
export interface IRegionWise {
    countMap?: ICountMap;
    totalCountRegion?: number;
}
export interface ICountMap {
    [location: string]: number;
}

export interface IScreenerMessage {
    date?: number;
    devices?: string;
    lane?: string;
    gate?: string;
    screenerMessage?: string;
}


export class IReportThroughputDate {
    constructor(
        public anomaly?: boolean,
        public id?: string,
        public noObjects?: boolean,
        public noThreatConfig?: string,
        public nonThreatCellphone?: string,
        public nonThreatKeys?: string,
        public threatHandgun?: string,
        public threatPipeBomb?: string,
        public threatRifle?: string,
        public threatStatus?: string,
        public creationTimestamp?: string,
        public threatDate?: Date) { }
}
