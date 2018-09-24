import {Component, OnInit} from '@angular/core';
import {ClientCredentials} from '../../../shared/ClientCredentials';
import { Router } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials: ClientCredentials;
  private token: string;

  public constructor(private cookieService: CookieService,
                     private router: Router,
                     private userService: UserService) { }

  ngOnInit(): void {
    this.credentials = ClientCredentials.empty();
  }

  login() {
    this.userService.login(this.credentials).subscribe();
  }

  recover() {

  }
}
