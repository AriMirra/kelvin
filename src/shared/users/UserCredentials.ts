export class UserCredentials {

  public static empty(): UserCredentials {
    return new UserCredentials( '', '', '', '', '');
  }

  constructor(private username: string,
              private password: string,
              private name: string,
              private lastName: string,
              private type: string) {}

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
