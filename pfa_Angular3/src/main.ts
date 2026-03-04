import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { httpInterceptorProviders } from './app/services/interceptors';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    ...httpInterceptorProviders
  ]
}).catch(err => console.error(err));

