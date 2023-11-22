import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CustomerService } from 'src/assets/services/customer.service';
import { DeviceDetectSimulatorService } from 'src/assets/services/device-detect-simulator.service';
import { DevicemanagementService } from 'src/assets/services/devicemanagement.service';
import { GenetecConfigurationService } from 'src/assets/services/genetec-configuration.service';
import { LocationService } from 'src/assets/services/location.service';
import { ShareDataService } from 'src/assets/services/share-data.service';
import { StatemonitoringService } from 'src/assets/services/statemonitoring.service';
import { TabletService } from 'src/assets/services/tablet.service';
import { ThreatActivityService } from 'src/assets/services/threat-activity.service';
import { UploadimageService } from 'src/assets/services/uploadimage.service';
import { UserRoleAuthService } from 'src/assets/services/user-role-auth.service';
import { UserSettingService } from 'src/assets/services/userSettingService';

import { AppComponent } from './app.component';
import { rootRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';
import { TokenInterceptor } from 'src/assets/auth/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from './shared';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    MatTabsModule,
    MatSortModule,
    NotifierModule, MatSnackBarModule,
    RouterModule.forRoot(rootRoutes, {
      // enableTracing :true, // For debugging
      // preloadingStrategy: PreloadAllModules,
      // initialNavigation: 'enabled',
      // useHash: false
    }),
    CoreModule,
    SharedModule,
    NgxSpinnerModule.forRoot()
  ],
  providers: [
    ThreatActivityService, UserSettingService,
    CustomerService, LocationService, UploadimageService,
    TabletService, DevicemanagementService, DeviceDetectSimulatorService, GenetecConfigurationService,
    StatemonitoringService, UserRoleAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
