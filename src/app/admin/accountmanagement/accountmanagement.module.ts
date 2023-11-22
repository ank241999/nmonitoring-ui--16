import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

// import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { TableDataService } from './services/table-data.service';
import { MatTableModule } from '@angular/material/table';

import { AccountManagementComponent } from './accountmanagement.component';
import { DashboardResolver } from './accountmanagement.resolver';

// import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { RegularTablesResolver, SmartTablesResolver } from './resolvers/tables.resolver';
import { AddaccountComponent } from './addaccount/addaccount.component';

import { ModifyaccountComponent } from './modifyaccount/modifyaccount.component';
import { MatButtonModule } from '@angular/material/button';
import { CoreModule } from '../../core/core.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

// import {
//   FormsValidationsResolver
// } from '../../forms/forms.resolver';

export const UserRoutes = [
  {
    path: '',
    component: AccountManagementComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      // data : Ng2ChartsResolver,
      tableData: SmartTablesResolver
    }
  },
  {
    path: 'addaccount',
    component: AddaccountComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
    resolve: {
      // data: FormsValidationsResolver
    }
  },
  {
    path: 'modifyaccount',
    component: ModifyaccountComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
  }

];

@NgModule({
  declarations: [
    AccountManagementComponent,
    AddaccountComponent,
    ModifyaccountComponent,
    BlockCopyPasteDirective
  ],
  imports: [
    RouterModule.forChild(UserRoutes),
    ReactiveFormsModule,
    CommonModule,
    // ng2ChartsModule,
    SharedModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatPaginatorModule, MatSortModule, MatButtonModule, CoreModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  // exports: [RouterModule],
  providers: [
    DashboardResolver,
    // Ng2ChartsResolver,
    // ChartsDataService,
    TableDataService,
    RegularTablesResolver,
    // ExtendedTablesResolver,
    SmartTablesResolver,
    // FormsValidationsResolver,
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AccountManagementModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
