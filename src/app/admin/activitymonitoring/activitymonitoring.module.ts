import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

// import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

// import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { ActivityMonitoringComponent } from './activitymonitoring.component';
import { DashboardResolver } from './activitymonitoring.resolver';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityThreatsComponent } from './activitythreats.component';
import { LogdetailsComponent } from './logdetails/logdetails.component';
import { ResetcountalertComponent } from './resetcountalert/resetcountalert.component';
import { ThreatLogService } from 'src/assets/services/threatlog.service';

export const UserRoutes = [
  {
    path: '',
    component: ActivityMonitoringComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      // data: Ng2ChartsResolver
    }
  },
  {
    path: 'activitythreats',
    component: ActivityThreatsComponent,
    resolve: {
      // data: Ng2ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    ActivityMonitoringComponent,
    ActivityThreatsComponent,
    LogdetailsComponent,
    ResetcountalertComponent
  ],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    // ng2ChartsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule, MatSortModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule, ReactiveFormsModule
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    DashboardResolver,
    ThreatLogService
    // Ng2ChartsResolver,
    // ChartsDataService,
    // ExtendedTablesResolver,
    // TableDataService
  ]
})
export class ActivityMonitoringModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
