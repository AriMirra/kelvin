export class Route {
  public static empty(): Route {
    return new Route('', '', '', 0, 0, 0, 0, false);
  }

  constructor(private id: string,
              private name: string,
              private productId: string,
              private minTemperature: number,
              private maxTemperature: number,
              private minHumidity: number,
              private maxHumidity: number,
              private vampire: boolean) {
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
}
