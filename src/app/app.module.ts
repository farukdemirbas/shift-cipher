import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CipherComponent } from './components/cipher/cipher.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeachLanguageComponent } from './components/teach-language/teach-language.component';
import { DecipherComponent } from './components/decipher/decipher.component';

@NgModule({
  declarations: [
    AppComponent,
    CipherComponent,
    TeachLanguageComponent,
    DecipherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
