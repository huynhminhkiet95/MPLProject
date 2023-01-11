export interface ConfiSystemDto
{
    boardisactive:boolean;
    inactivemessage:string;
    systemname:string;
    administratoremailaddress:string;
    alertandnotifyemail:string;
    address:string;
    hotline:string;
    fax:string;
    datetimeformat:string;
    defaultcurrency:string;
    workingday:string;
    empcodepre:string;
}
export interface ConfiParam
{
    ParaName:string
    ParaValue:string
    ParaDesc:string;
    Type:string;
    SubsidiaryId:string;
}