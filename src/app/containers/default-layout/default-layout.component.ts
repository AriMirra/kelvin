import {Component, Input} from '@angular/core';
import {adminNavItems} from '../../_adminNav';
import {clientNavItems} from '../../_clientNav';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
    public navItems;
    public loggedUserType;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;

    /**
     * Constructor that modifies nav content depending on user type.
     */
    constructor() {
        if (this.loggedUserType) {
            if (this.loggedUserType === 'ADMIN') {
                this.navItems = adminNavItems;
            } else if (this.loggedUserType === 'CLIENT') {
                this.navItems = clientNavItems;
            }
        } else {
            this.navItems = adminNavItems;
        }

        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });

        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }
}
