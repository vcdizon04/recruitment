import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { NgxSortableModule } from 'ngx-sortable'


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
    NgxSortableModule 
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: routingComponents
})
export class AppModule { }
