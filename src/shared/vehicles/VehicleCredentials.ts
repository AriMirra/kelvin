export class VehicleCredentials {

  public static empty(): VehicleCredentials {
    return new VehicleCredentials('', '', 0, '', '');
  }

  constructor(private ownerId: string,
              private domain: string,
              private wheels: number,
              private brand: string,
              private model: string) {
  }


  public asJson() {
    return {
      ownerId: this.ownerId,
      domain: this.domain,
      wheels: this.wheels,
      brand: this.brand,
      model: this.model,
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}