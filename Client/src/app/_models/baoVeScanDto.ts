export class ViewLogGateModel {
    type: string;
    vehicleNo: string;
    dateF: any;
    dateT: any;

    constructor() {
        this.type = "";
        this.vehicleNo = "";
        this.dateF = new Date();
        this.dateT = new Date();
    }
}

export class EntryExitLogSearchModel {
    employeeName: string;
    mobile: string;
    subsidary: string;
    division: string;
    department: string;
    employeecode: string;
    vehicleNo: string;

    constructor() {
        this.employeeName = "";
        this.mobile = "";
        this.subsidary = "";
        this.division = "";
        this.department = "";
        this.employeecode = "";
        this.vehicleNo = "";
    }
}

export class EntryExitLogModel {
    vehicle: string;
    vehicleNo: string;
    employeeName: string;
    mobile: string;
    divisionDesc: string;
    deptDesc: string;
    equipmentNo: string;
    createDate: any;
    createUser: string;
    mode: string;
    memo: string;
    relatedPerson: string;
    employeeId: any;
    avartarThumbnail: string;
    autosave: boolean;

    constructor() {
        this.mode = "IN";
        this.autosave = false;
        this.equipmentNo = "";
        this.createDate = new Date();
        this.createUser = "";
        this.mode = "";
        this.memo = "";
        this.relatedPerson = "";
        this.employeeId = "";
    }
}