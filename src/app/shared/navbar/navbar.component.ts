import { Component } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  loggedIn: boolean = false;

  constructor(private socialAuthService: SocialAuthService, private cookieService: CookieService) {}

  ngOnInit() {
    this.loggedIn = this.cookieService.check('adfluenceUserInfo');
  }

  signOut() {
    this.cookieService.delete('adfluenceUserInfo');
    this.loggedIn = false;
    console.log('Logged in status: ', this.loggedIn);
    window.location.reload();
  }

}
