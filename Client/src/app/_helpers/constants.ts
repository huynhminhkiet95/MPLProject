/*********************************************************
 * File Name: Constants
 * Created By: hau.le
 * Created Date: 20/02/2020
 * Description:
 *********************************************************/

const Constants = {

  APP_CONFIG: {
    min_date: '2010/02/01'
    , grant_type: 'password'
    , mpi_session: 'MPI_SESSION'
    , default_password: '123456'
    , default_role_id: '5A6869E0-1C3D-11E8-ACCF-0ED5F89F718B'
    , plat_form_id: 'WB_MPI'
    , no_avatar: '/assets/img/missing_avatar.svg.png'
  }
  , DEFAULT_GROUPS: {
    wb_mpi: 'IT001'
    , wb_ent: 'MT001'
  }
  , LOCAL_STORAGE: {
    languages: 'languages'
    , current_user: 'currentUser'
    , user_private_info: 'userPrivateInfo'
    , img_avatar: 'imgAvatar'
    , current_menus: 'currentmenus'
    , authen_info: 'authenInfo'
    , key: 'key'
    , value: 'value'
    ,theme_option:"theme_option"
  }
  , CONTENT_TYPES: {
    application_json: 'application/json'
    , application_form: 'application/x-www-form-urlencoded'
  }
  , AUTHEN_FIELDS: {
    access_token: 'access_token'
    , as_employee_id: 'as:employee_id'
    , as_system_id: 'as:system_id'
  }
  , MPI_URLS: {
    sso_authen_token: 'token'
    , login: '/login'
    , uploads: 'uploads/'
    , group_permissions_admin: 'intranet/administrator/group-permissions-admin'
  }
  , REQUEST_HEADERS: {
    authorization: 'Authorization'
    , accept: 'Accept'
    , content_type: 'Content-Type'
  }
  , API_KEYS: {
    payload: 'payload'
    , message: 'message'
    , success: 'success'
    , error: 'error'
  }
  , DATE_FORMAT: {
    yyyymm: 'YYYYMM'
    , yyyymmdd: 'YYYY/MM/DD'
    , ddmmyyyy: 'DD/MM/YYYY'
    , mmddyyyy: 'MM/DD/YYYY'
    , mmddyyyy_hh_mm: 'MM/DD/YYYY HH:mm'
    , ddmmyyyy_hh_mm: 'DD/MM/YYYY HH:mm'
    , yyyymmdd_hh_mm: 'YYYY/MM/DD HH:mm'
    , mm_dd_yyyy: 'MM-DD-YYYY'
    , yyyy_mm_dd: 'YYYY-MM-DD'
    , dd_mm_yyyy: 'DD-MM-YYYY'
    , yyyy_mm_dd_hh_mm_ss: 'YYYY-MM-DD HH:mm:ss'
    , yyyy_mm_dd_hh_mm: 'YYYY-MM-DD HH:mm'
    , yyyymmddhhmmss: 'YYYYMMDDHHmmss'
    , hh_mm: 'HH:mm'
    , hh_mm_ss: 'HH:mm:ss'
    , not_gtm: 'YYYY-MM-DDTHH:mm:ss'
  }
  , NOTIFICATIONS: {
    confirm_delete: 'Are you sure delte this row?'
    , can_not_update: 'Can\'t update'
    , delete_success: 'Delete success'
    , delete_fail: 'Delete fail'
    , delete_file_success: 'Delete file success'
    , delete_file_fail: 'Delete file fail'
    , save_success: 'Save success'
    , save_fail: 'Save fail'
    , save_file_success: 'Save file success'
    , save_fle_fail: 'Save file fail'
    , update_success: 'Update success'
    , update_fail: 'Update fail'
    , data_exists: 'Data exists'
    , data_not_exists: 'Data not exists'
    , get_params_error: 'Get params error'
    , get_subsidiary_error: 'Can`t not get subsidiary'
  }
  , ACTIONS: {
    insert: 'INSERT'
    , update: 'UPDATE'
    , delete: 'DELETE'
  }
  , CODE_TYPE: {
    gender: 'GENDER'
    , emp_type: 'EMPTYPE'
    , grade: 'GRADE'
    , desgination: 'DESGINATION'
    , id_type: 'IDTYPE'
    , emp_status: 'EMPSTATUS'
    , vehicle_type: 'VEHICLETYPE'
    , gallery: 'GALLERY'
    , contract_type: 'CONTRACTTYPE'
    , tspost_type: 'TSPOSTTYPE'
    , hrexp_year: 'HREXPYEAR'
    , hrage_range: 'HRAGERANGE'
    , hredu_level: 'HREDULEVEL'
    , docgen_status: 'DOCGENSTATUS'
    , cost_center: 'COSTCENTER'
    , ann_type: 'ANNTYPE'
    , it_service: 'ITSERVICE'
    , svc_type: 'SVCTYPE'
    , srs_tatus: 'SRSTATUS'
    , priority: 'PRIORITY'
    , hrleave_type: 'HRLEAVETYPE'
    , month: 'MONTH'
    , hrleaveadj_type: 'HRLEAVEADJTYPE'
    , cpumodel: 'CPUMODEL'
    , has_activity_type: 'HASACTIVITYTYPE'
    , year: 'YEAR'
    , wk_name_drole: 'WKNAMEDROLE'
    , doc_reply_type: 'DOCREPLYTYPE'
    , hrer: 'HRER'
    , her: 'HER'
    , OFREQSTATUS:'OFREQSTATUS'
  }
  , FILE_EXTENSION: {
    all: 'JPG,GIF,PNG,PDF,DOC,DOCX,XLSX,XLS,JPEG,PPTX,PPT,MSG,TIF,TXT'
  }
}

export const _const = Constants;