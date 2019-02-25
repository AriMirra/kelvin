/**
 * Model that represents the credentials of an user.
 */
export class UserCredentials {

  public static empty(): UserCredentials {
    return new UserCredentials('', '', '', '', 'USER');
  }

  constructor(public username: string,
              public password: string,
              public name: string,
              public lastName: string,
              public type: string) {
  }

  public asJson() {
    return {
      username: this.username,
      password: this.password,
      name: this.name,
      lastName: this.lastName,
      type: this.type
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}
