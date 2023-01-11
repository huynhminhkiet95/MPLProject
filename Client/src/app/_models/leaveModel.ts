import * as moment from 'moment';

export class LeaveModel {
    lvNo: string;
    employeeId: number;
    fromDate: any;
    toDate: any;
    leaveDays: number;
    remark: string;
    userId: number;
    ampmFull: string;
    leaveType: String;
    leaveStatus: String;
    marker: String;
    attachments: any = [];
    division:any;
    constructor() {
        //this.Remark = '- Lý do nghỉ: \n- Công việc bàn giao: \n- Người nhận bàn giao: \n- Thông tin liên lạc: ';
    }

    convertDate() {
        this.fromDate = moment(this.fromDate).format('YYYY-MM-DD HH:mm');
        this.toDate = moment(this.toDate).format('YYYY-MM-DD HH:mm');
    }
}
export class ReasonLeave {
    reason: string;
    jobtranfer: string;
    emptranfer: string;
    contact: string;
    getRemark() {
        return '- Lý do nghỉ: ' + this.reason +
            '\n- Công việc bàn giao: ' + this.jobtranfer +
            '\n- Người nhận bàn giao: ' + this.emptranfer +
            '\n- Thông tin liên lạc: ' + this.contact;
    }
    loadRemark(remark: String) {
        let arrRemark = remark.split('\n');
        if (arrRemark.length == 4) {
            this.reason = arrRemark[0].split(':')[1];
            this.jobtranfer = arrRemark[1].split(':')[1];
            this.emptranfer = arrRemark[2].split(':')[1];
            this.contact = arrRemark[3].split(':')[1];
        }
    }
}