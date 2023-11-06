import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { of } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  private accessToken = '';

  constructor(private socialAuthService: SocialAuthService, private cookieService: CookieService, private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.accessToken = user?.idToken || '';
      this.loggedIn = user != null;
      this.cookieService.set('adfluenceUserInfo', JSON.stringify(this.user));
    });
    const urlPath = state.url;
    if(this.cookieService.check('adfluenceUserInfo') && urlPath.includes('login')){
      this.router.navigate(['/']);
      return false;
    }
    else if(!this.cookieService.check('adfluenceUserInfo') && urlPath.includes('login')){
      return true;
    }
    
    return this.cookieService.check('adfluenceUserInfo');
  }

  AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean => {
    return inject(AuthGuardService).canActivate(route, state);
  };
}
