import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ChartsModule as ng2ChartsModule } from 'ng2-charts';


import { SharedModule } from '../../shared';

// import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';


// import { DashboardResolver } from './settings.resolver';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SettingsPageComponent } from './settings.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ChartsDataService, Ng2ChartsResolver } from '../../charts';

export const settingsRoutes = [
  {
    path: '',
    component: SettingsPageComponent,
    resolve: {
      // data : Ng2ChartsResolver
    }
  }

];

@NgModule({
  declarations: [
    SettingsPageComponent
  ],
  imports: [
    RouterModule.forChild(settingsRoutes),
    CommonModule,
    // ng2ChartsModule,
    SharedModule,
    MatTableModule, MatSlideToggleModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [RouterModule],
  providers: [
    // Ng2ChartsResolver,
    // ChartsDataService,
    // ExtendedTablesResolver,
    // TableDataService
  ]
})
export class settingsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
