/**
 * Model that represents the credentials of an user which contains:
 *
 * @param {string} id
 * @param {string} username
 * @param {string} password
 * @param {string} name
 * @param {string} lastName
 * @param {string} type
 */
export class User {

  public static empty(): User {
    return new User('', '', '', '', '', '');
  }

  constructor(public id: string,
              public username: string,
              public password: string,
              public name: string,
              public lastName: string,
              public type: string) {
  }

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

  /**
   * Method that returns the full name of an user by concatenating it's first and last name.
   *
   * @returns {string}
   */
  public getFullName(): string {
    return `${this.lastName}, ${this.name}`;
  }

}
