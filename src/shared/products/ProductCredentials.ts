/**
 * Model that represents the credentials of a product which contains:
 *
 * @param {string} name
 * @param {number} minTemperature
 * @param {number} maxTemperature
 * @param {number} minHumidity
 * @param {number} maxHumidity
 * @param {boolean} vampire
 */
export class ProductCredentials {

  public static empty(): ProductCredentials {
    return new ProductCredentials('', 0, 0, 0, 0, false);
  }

  constructor(public name: string,
              public minTemperature: number,
              public maxTemperature: number,
              public minHumidity: number,
              public maxHumidity: number,
              public vampire: boolean) {
  }

  public asJson() {
    return {
      name: this.name,
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

}
