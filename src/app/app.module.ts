import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';

// Servicios
import { ServiceModule } from './services/service.module';

// Modulos
import { PagesModule } from './pages/pages.module';

// Temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NopagefoundComponent,
    RegisterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    PagesModule,
    ReactiveFormsModule,
    ServiceModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
