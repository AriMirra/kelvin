/**
 * Model that represents a product which contains:
 *
 * @param {string} id
 * @param {string} name
 * @param {number} minTemperature
 * @param {number} maxTemperature
 * @param {number} minHumidity
 * @param {number} maxHumidity
 * @param {boolean} vampire
 */
export class Product {

  public static empty(): Product {
    return new Product('', '', 0, 0, 0, 0, false);
  }

  constructor(public id: string,
              public name: string,
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
