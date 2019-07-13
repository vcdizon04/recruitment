import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LogInComponent,
    DepartmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
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
    AdminGuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: routingComponents
})
export class AppModule { }
