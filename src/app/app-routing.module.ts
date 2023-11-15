import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './features/pages/landing-page/landing-page.component';
import { LoginComponent } from './features/pages/login/login.component';
import { AuthGuardService } from './core/services/auth-guard-service/auth-guard.service';
import { PrivacyComponent } from './features/pages/privacy/privacy.component';
import { TermsOfServiceComponent } from './features/pages/terms-of-service/terms-of-service.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
