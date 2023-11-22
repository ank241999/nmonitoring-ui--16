import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import { CoreModule } from '../core/core.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';

// import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
import { RegisteragainComponent } from './registeragain/registeragain.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServerURLComponent } from './login/server-url/server-url.component';
import { TermsComponent } from './terms/terms.component';
import { IntermediateComponent } from './login/intermediate.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../core/core.module';
import { NotifierModule } from 'angular-notifier';
import { NotificationService } from 'src/assets/services/notification.service';


@NgModule({
  imports: [
    CommonModule, UserRoutingModule,
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    NotifierModule,
    // FlexLayoutModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CoreModule
  ],
  declarations: [UserComponent, LoginComponent, RegisterComponent, BlockCopyPasteDirective,
    AlreadyloginComponent, AlreadyloginalertComponent, RegisteragainComponent, ServerURLComponent,
    TermsComponent, IntermediateComponent, ConfirmComponent, AccessdeniedComponent, ResetPasswordComponent],
  providers: [DatePipe, NotificationService]
})
export class UserModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
