import {Component, OnInit} from '@angular/core';
import {adminNavItems} from '../../_adminNav';
import {clientNavItems} from '../../_clientNav';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  private userType: UserType;

  constructor(private cookieService: CookieService, private router: Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

  }

  ngOnInit(): void {
    if (this.cookieService.check('UserType')) {
      this.userType = (this.cookieService.get('UserType') === 'ADMIN') ? UserType.ADMIN : UserType.CLIENT;
      this.displayNavBar();
    } else {
      this.displayDefaultNavBar();
    }
  }

  /**
   * Method that removes the user type token from browser and redirects to login page.
   */
  logout() {
    this.cookieService.delete('token');
    this.cookieService.delete('UserType');
    this.router.navigate(['']).then();
  }

  /**
   * Method that renders a determined nav based on user type token.
   */
  private displayNavBar() {
    this.navItems = this.userType === UserType.ADMIN ? adminNavItems : clientNavItems;
  }

  /**
   * Method that renders admin's nav items for folks that are lazy.
   */
  private displayDefaultNavBar() {
    this.navItems = clientNavItems;
  }

}

export enum UserType {
  ADMIN,
  CLIENT
}
