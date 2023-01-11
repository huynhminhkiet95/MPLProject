import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';
import { exec } from 'child_process';

@Injectable()
export class StdCodeService {

    private urlAPI: string;

    constructor(
        public execAPI: ExecCallApi
    ) {
        this.urlAPI = 'stdcodeservice';
    }

    getByCodeType(codeType: string) {
        const _endPoint = `${this.urlAPI}/stdcode/getbytype/${codeType}`;
        return this.execAPI.getDataApi(_endPoint);
    }

    stdCodeCodeTypes() {
        const _endPoint = `${this.urlAPI}/stdcode/getcombobox`;
        return this.execAPI.getDataApi(_endPoint);
    }

    insertStdCode(model: any) {
        const _endPoint = `${this.urlAPI}/stdcode/insert`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    updateStdCode(model: any) {
        const _endPoint = `${this.urlAPI}/stdcode/update`;
        return this.execAPI.putDataApi(_endPoint, model);
    }
}