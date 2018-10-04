export class ProductCredentials {
  public static empty(): ProductCredentials {
    return new ProductCredentials( '', 0, 0, 0, 0, false);
  }

  constructor(private name: string,
              private minTemperature: number,
              private maxTemperature: number,
              private minHumidity: number,
              private maxHumidity: number,
              private vampire: boolean) {
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
