export class User {

  public static empty(): User {
    return new User('', '', '', '', '', '');
  }

  constructor(public id: string,
              public username: string,
              public password: string,
              public name: string,
              public lastName: string,
              public type: string) {}

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

  public getFullName(): string {
    return `${this.lastName}, ${this.name}`;
  }

}
