import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Theme } from './symbols';
import { CommonService, SSOCommonService } from '../_services';
import { Globalconst } from '../_helpers';

@Directive({
    selector: '[theme]'
})
export class ThemeDirective implements OnInit, OnDestroy {

    private _destroy$ = new Subject();

    constructor(
        private _elementRef: ElementRef,
        private _themeService: ThemeService,
        private _commonService: SSOCommonService,
        private _globalConfig:Globalconst
    ) { }

    async ngOnInit() {
         
        let config = this._globalConfig._themeOption;
        if(!config || !config.colortheme)
        {
            let themeConfig =  await this._commonService.getConfigurationAsysn("S1", "GENERATE");
            if(themeConfig){
                config = themeConfig["payload"];
                this._globalConfig._themeOption=config;
            }
               
        }
        const primaryTheme: Theme = {
            name: 'light',
            properties: {
                '--background': config.colortheme,
                '--background-header': '#dfe6e9',
                '--font-color-menu': config.norframfontcolor,
                '--font-color-normal':config.norfontclor
            }
        };
        this.updateTheme(primaryTheme);
        this._themeService.themeChange
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme: Theme) => this.updateTheme(theme));
       

        // const active = this._themeService.getActiveTheme();
        // if (active) {
        //   this.updateTheme(active);
        // }


    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    updateTheme(theme: Theme) {
        // project properties onto the element
        for (const key in theme.properties) {
            this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
        }

        // remove old theme
        for (const name of this._themeService.theme) {
            this._elementRef.nativeElement.classList.remove(`${name}-theme`);
        }

        // alias element with theme name
        this._elementRef.nativeElement.classList.add(`${theme.name}-theme`);
    }

}
