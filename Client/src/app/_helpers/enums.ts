export enum EnumResponse {
  DATA_EXISTS       = -1
  , VALIDATE_ERROR  = 0
  , SUCCESS         = 1
}

//type Systems = 'WB_MPI' | 'WB_ENT'
export enum EnumMPLSystem {
  WB_MPI      = <any>'WB_MPI'
  , WB_ENT    = <any>'WB_ENT'
  , DEFAULT   = WB_MPI
}

export enum EnumLanguage {
  ENGLISH       = <any>'EN'
  , VIETNAMESE  = <any>'VN'
  , KOREAN      = <any>'KO'
  , DEFAULT     = ENGLISH
}