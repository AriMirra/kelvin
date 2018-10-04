export class Vehicle {

  public static empty(): Vehicle {
    return new Vehicle('', '', '', 0, '', '', '');
  }

  constructor(private id: string,
              private ownerId: string,
              private domain: string,
              private wheels: number,
              private brand: string,
              private model: string,
              private deviceId: string) {}


  public asJson() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      domain: this.domain,
      wheels: this.wheels,
      brand: this.brand,
      model: this.model,
      deviceId: this.deviceId
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}
