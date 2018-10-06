export class Coordinate {
  public static empty(): Coordinate {
    return new Coordinate('', '');
  }

  constructor(private lat: string,
              private lon: string) {}


  public asJson() {
    return {
      lat: this.lat,
      lon: this.lon
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }
}
