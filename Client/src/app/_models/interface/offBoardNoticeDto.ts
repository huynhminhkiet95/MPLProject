export class OffBoardNoticeDTO {
    employeeId: number;
    expectedLeaveDate: any;
    reasonToLeave: String;
    reasonRemark: String;
    leaveDateType: String;
    requestStatus: String;
    createDate: any;
    createUser: number;
    confirmedLastday: String;
    completeDate: any;
    hODConfirmRemark: String;
    hDPConfirmRemark: String;
    constructor(){
        this.requestStatus='';
    }
}