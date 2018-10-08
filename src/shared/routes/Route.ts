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

  public checksTemperature(): boolean {
    return this.hasMinTemp() || this.hasMaxTemp();
  }

  public checksHumidity(): boolean {
    return this.hasMaxHumidity() || this.hasMinHumidity();
  }

  public hasMinTemp(): boolean {
    return !this.isUndefined(this.minTemperature);
  }

  public hasMaxTemp(): boolean {
    return !this.isUndefined(this.maxTemperature);
  }

  public hasMinHumidity(): boolean {
    return !this.isUndefined(this.minHumidity);
  }

  public hasMaxHumidity(): boolean {
    return !this.isUndefined(this.maxHumidity);
  }

  private isUndefined(val): boolean {
    return val === undefined || val === null;
  }
}
