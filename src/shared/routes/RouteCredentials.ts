/**
 * Model that represents the credentials of a route.
 */
export class RouteCredentials {

  public static empty(): RouteCredentials {
    return new RouteCredentials('', '', 0, 0, 0, 0, false);
  }

  constructor(private name: string,
              private productId: string,
              private minTemperature: number,
              private maxTemperature: number,
              private minHumidity: number,
              private maxHumidity: number,
              private vampire: boolean) {
  }

  public asJson() {
    return {
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

}
