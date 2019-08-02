import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from './services/database.service';

import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { StarRatingModule } from 'angular-star-rating';
import { LogInComponent } from './components/log-in/log-in.component';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from './services/email.service';
import { AdminGuardService } from './admin/admin.guard.service';
import { DepartmentsComponent } from './components/departments/departments.component';
import { MissingRequirmentsComponent } from './components/client-page/missing-requirments/missing-requirments.component';
import { CsvGeneratorService } from './services/csv-generator.service';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LogInComponent,
    DepartmentsComponent,
    MissingRequirmentsComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxSpinnerModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    StarRatingModule.forRoot(),
    NgxDocViewerModule
  ],
  providers: [
    DatabaseService,
    EmailService,
    AdminGuardService,
    CsvGeneratorService
  ],
  bootstrap: [AppComponent],
  entryComponents: routingComponents
})
export class AppModule { }
