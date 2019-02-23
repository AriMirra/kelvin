import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from '../../services/user.service';
import {ClientCredentials} from '../../../shared/users/ClientCredentials';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials: ClientCredentials;
  public errorOnLogin: boolean;
  private timeout: any;

  public constructor(private cookieService: CookieService,
                     private router: Router,
                     private userService: UserService) {
  }

  ngOnInit(): void {
    const userType: string = this.cookieService.get('UserType');
    if (userType) {
      userType === 'ADMIN' ? this.router.navigate(['/admin']) : this.router.navigate(['/client']);
    }
    this.credentials = ClientCredentials.empty();
    this.errorOnLogin = false;
  }

  /**
   * Logs in user and redirects view based on user type.
   */
  login() {
    this.userService.login(this.credentials).subscribe(success => {
      if (success) {
        this.userService.getLoggedUser().subscribe(user => {
          if (user.type === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/client']);
          }
        });
      } else {
        this.showErrorMessage();
      }
    });
  }

  /**
   * Shows error message on timeout.
   */
  showErrorMessage() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.errorOnLogin = false, 3000);
    this.errorOnLogin = true;
  }

  recover() {

  }
}
