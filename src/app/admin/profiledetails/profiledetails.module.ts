import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
// import { MatButtonModule, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
// import { NouisliderModule } from 'ng2-nouislider';
// import { CoreModule } from '@angular/flex-layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DashboardResolver } from '../admin.resolver';
// import { Ng2ChartsResolver } from '../../charts';
// import { FormsValidationsResolver } from '../../forms';
import { ProfiledetailsComponent } from './profiledetails.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CoreModule } from 'src/app/core';
import { MatTableModule } from '@angular/material/table';
import { RegularTablesResolver } from '../accountmanagement/resolvers/tables.resolver';
// import { RegularTablesResolver } from '../../tables';

export const UserRoutes = [
  {
    path: '',
    component: ProfiledetailsComponent
  },
];

@NgModule({
  declarations: [ProfiledetailsComponent],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    SharedModule,
    MatTableModule,
    // NouisliderModule,
     MatPaginatorModule, MatSortModule, MatButtonModule, CoreModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DashboardResolver,
    // Ng2ChartsResolver,
    RegularTablesResolver,
    // FormsValidationsResolver,
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfiledetailsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
