import { Component } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  websocketURL : string = environment.chatgptWebSocketURL;
  private socket!: WebSocket;

  constructor(
    private authService: SocialAuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.socket = new WebSocket(this.websocketURL);
    this.authService.authState.subscribe((user) => {
      this.cookieService.set('adfluenceUserInfo', JSON.stringify(user));
      const userInfo = { firstName: user.firstName, lastName: user.lastName, emailAddress: user.email };
      this.socket.send(JSON.stringify(userInfo));
      window.location.reload();
    });

    this.loggedIn = this.cookieService.check('adfluenceUserInfo');
    if (this.loggedIn) {
      let cookieUserInfo: SocialUser = JSON.parse(this.cookieService.get('adfluenceUserInfo'));
      console.log(cookieUserInfo);
      this.user = cookieUserInfo;
    }
  }

}
