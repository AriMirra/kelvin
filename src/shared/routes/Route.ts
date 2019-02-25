/**
 * Model that represents a route which contains:
 *
 * @param {string} id
 * @param {string} name
 * @param {string} productId
 * @param {number} minTemperature
 * @param {number} maxTemperature
 * @param {number} minHumidity
 * @param {number} maxHumidity
 * @param {boolean} vampire
 */
export class Route {

  public static empty(): Route {
    return new Route('', '', '', undefined, undefined, undefined, undefined, false);
  }

  public static clone(r: Route): Route {
    return new Route(r.id, r.name, r.productId, r.minTemperature, r.maxTemperature, r.minHumidity, r.maxHumidity, r.vampire);
  }

  constructor(public id: string,
              public name: string,
              public productId: string,
              public minTemperature: number,
              public maxTemperature: number,
              public minHumidity: number,
              public maxHumidity: number,
              public vampire: boolean) {
  }

  public asJson() {
    return {
      id: this.id,
      name: this.name,
      productId: this.productId,
      minTemperature: this.minTemperature,
      maxTemperature: this.maxTemperature,
      minHumidity: this.minHumidity,
      maxHumidity: this.maxHumidity,
      vampire: this.vampire
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

  /**
   * Method that returns true if route has a minimum or maximum value for temperature
   *
   * @returns {boolean}
   */
  public checksTemperature(): boolean {
    return this.hasMinTemp() || this.hasMaxTemp();
  }

  /**
   * Method that returns true if route has a minimum or maximum value for humidity
   *
   * @returns {boolean}
   */
  public checksHumidity(): boolean {
    return this.hasMaxHumidity() || this.hasMinHumidity();
  }

  /**
   * Method that returns true if route has a minimum defined value for temperature
   *
   * @returns {boolean}
   */
  public hasMinTemp(): boolean {
    return !this.isUndefined(this.minTemperature);
  }

  /**
   * Method that returns true if route has a maximum defined value for temperature
   *
   * @returns {boolean}
   */
  public hasMaxTemp(): boolean {
    return !this.isUndefined(this.maxTemperature);
  }

  /**
   * Method that returns true if route has a minimum defined value for humidity
   *
   * @returns {boolean}
   */
  public hasMinHumidity(): boolean {
    return !this.isUndefined(this.minHumidity);
  }

  /**
   * Method that returns true if route has a maximum defined value for humidity
   *
   * @returns {boolean}
   */
  public hasMaxHumidity(): boolean {
    return !this.isUndefined(this.maxHumidity);
  }

  /**
   * Method that returns true if given val is undefined or null.
   *
   * @param val
   * @returns {boolean}
   */
  private isUndefined(val): boolean {
    return val === undefined || val === null;
  }

}
