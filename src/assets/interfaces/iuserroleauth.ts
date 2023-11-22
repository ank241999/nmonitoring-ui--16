export interface IUserRoleAuth {
    id?: number;
    endPoint?: string;
}

export interface IRole {
    id?: number;
    roleName?: string;
    accessLevelID?: string;
    keyName?: string;
}

export interface ICapability {
    id?: number;
    capabilityName?: string;
    endPoint?: string;
    description?: string;
}

export interface IRoleCapability {
    id?: number;
    capabilityID?: number;
    roleID?: number;
    isActive: boolean;
    accessLevelID: number;
}

export class RoleCapability {
    constructor(
        public id: number,
        public capabilityID: number,
        public roleID: number,
        public isActive: boolean,
        public accessLevelID: number) { }
}

export interface IAccesslevel {
    id?: number;
    accessLevels?: string;
    keyName?: string;
    label?: string;
}
