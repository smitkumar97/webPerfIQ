import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/interceptor';
import { ReportComponent } from './components/report/report.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InputComponent } from './shared/input/input.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormComponent } from './components/form/form.component';
import { RecommendationsComponent } from './shared/recommendations/recommendations.component';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { ButtonComponent } from './shared/button/button.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr'

@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    InputComponent,
    ButtonComponent,
    LoaderComponent,
    FormComponent,
    RecommendationsComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    HighlightDirective,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
