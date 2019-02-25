import {User} from './User';

/**
 * Model that represents the update of an user's data.
 */
export class UserUpdate {

  public static empty(): UserUpdate {
    return new UserUpdate('', '', '', '');
  }

  public static for(user: User): UserUpdate {
    return new UserUpdate(user.username, user.password, user.name, user.lastName);
  }

  constructor(public username: string,
              public password: string,
              public name: string,
              public lastName: string) {
  }

  public asJson() {
    return {
      username: this.username,
      password: this.password,
      name: this.name,
      lastName: this.lastName,
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}
