import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ButtonPdfComponent } from './components/button-pdf/button-pdf.component';

@NgModule({
  declarations: [AppComponent, ButtonPdfComponent],
  imports: [BrowserModule, AppRoutingModule],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
