export interface IStateMonitoring {
    [serviceName: string]: {
        status: string;
        details: {
            [url: string]: string;
        };
    };
}

export interface IAllProcessResponse {
    description?: string;
    pid?: number;
    stderr_logfile?: string;
    stop?: number;
    logfile?: string;
    exitstatus?: number;
    spawnerr?: string;
    now?: number;
    group?: string;
    name?: string;
    statename?: string;
    start?: number;
    state?: number;
    stdout_logfile?: string;
}

export interface IAllProcessRearrange {
    FPGAInterface?: string;
    AiAggregate?: string;
    Capture?: string;
    DataReduction?: string;
    Drfits?: string;
    ImageReconstruction?: string;
    Recorder?: string;
    Webapi?: string;
    Webserver?: string;
}
