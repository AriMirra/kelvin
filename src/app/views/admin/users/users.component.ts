import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {UserCredentials} from '../../../../shared/users/UserCredentials';
import {User} from '../../../../shared/users/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  addingUser: boolean;

  users: User[] = [];

  userSearch = '';

  newUser: UserCredentials = UserCredentials.empty();
  successfulAdd: boolean;
  showSubmitMsg = false;

  deleteUserId: string;
  successfulDelete: boolean;
  showDeleteMsg = false;

  constructor(private userService: UserService) {
    this.addingUser = false;
    this.userService.fetchUsers().subscribe(res => {
      this.users = res;
    });
  }

  ngOnInit() {
  }

  // Add

  toggleAddingUser() {
    this.addingUser = !this.addingUser;
  }

  submitUser() {
    this.userService
      .addUser(this.newUser)
      .subscribe(submitted => {
        this.successfulAdd = submitted;
        this.showSubmitMsg = true;
        setTimeout(() => this.showSubmitMsg = false, 1000);
      });
  }

  // Delete

  startUserDelete(id: string) {
    this.deleteUserId = id;
  }

  deleteUser() {
    this.userService
      .deleteUser(this.deleteUserId)
      .subscribe(deleted => {
        this.successfulDelete = deleted;
        this.showDeleteMsg = true;
        setTimeout(() => this.showDeleteMsg = false, 1000);
      });
  }

  cancelDelete() {
    this.deleteUserId = undefined;
  }

  // Search

  filteredUsers(): User[] {
    return this.users.filter(user => this.userSearchFilter(user));
  }

  userSearchFilter(user: User): boolean {
      return !![user.lastName, user.username, user.name]
        .map(e => e.toLowerCase())
        .find(e => e.includes(this.userSearch));
  }

}
