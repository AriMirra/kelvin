export class Route {
  public static empty(): Route {
    return new Route('', '', '', undefined, undefined, undefined, undefined, false);
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
}
