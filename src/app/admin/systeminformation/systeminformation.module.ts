import { NgModule } from '@angular/core';
import { SysteminformationComponent } from './systeminformation.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RebootComponent } from './reboot/reboot.component';

export const TabletRoutes = [
  {
    path: '',
    component: SysteminformationComponent,
  }
];

@NgModule({
  declarations: [SysteminformationComponent, RebootComponent],
  imports: [
    RouterModule.forChild(TabletRoutes),
    CommonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  // entryComponents: [RebootComponent]
})
export class SysteminformationModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
