export class User {

  public static empty(): User {
    return new User('', '', '', '', '', '');
  }

  constructor(private id: string,
              private username: string,
              private password: string,
              private name: string,
              private lastName: string,
              private type: string) {}

  public asJson() {
    return {
      id: this.id,
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
