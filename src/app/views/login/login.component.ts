import {Component, OnInit} from '@angular/core';
import {ClientCredentials} from '../../../shared/ClientCredentials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials: ClientCredentials;

  // TODO: authService
  public constructor(private router: Router) { }

  ngOnInit(): void {
    this.credentials = ClientCredentials.empty();
  }

  login() {
    this.router.navigate(['admin']);
  }

  recover() {

  }
}
