export class MessageDto {
    id:string;
    userId: string;
    userName:string;
    status: string;//create,update,remove,view,active,inactive
    link:string;
    title:string;
    content:string;
    type:string;//login,itrequest,servicerequest,leaverequest,leaveaproval,serviceapproval
    createdDate:Date;
    constructor(username='', message='',id="") {
        this.userName = username;
        this.content = message;
        this.status = 'true';
        this.createdDate = new Date();
        this.id=id;
    }
    
}
