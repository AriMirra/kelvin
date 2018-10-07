import {Component, Input, OnInit} from '@angular/core';
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
        this.cookieService.set('UserType', 'admin');
        if (this.cookieService.check('UserType')) {
            this.userType = (this.cookieService.get('UserType') === 'ADMIN') ? UserType.ADMIN : UserType.CLIENT;
        } else {
            throw Error('cookie UserType not found');
        }
        this.displayNavBar();
    }
    logout() {
        this.cookieService.delete('token');
        this.cookieService.delete('UserType');
        this.router.navigate(['']).then();
    }
    private displayNavBar() {
        this.navItems = this.userType === UserType.ADMIN ? adminNavItems : clientNavItems;
    }
}

export enum UserType {
    ADMIN,
    CLIENT
}
