export class Vehicle {

  public static empty(): Vehicle {
    return new Vehicle('', '', '', 0, '', '', '');
  }

  constructor(public id: string,
              public ownerId: string,
              public domain: string,
              public wheels: number,
              public brand: string,
              public model: string,
              public deviceId: string) {}

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

  public hasOwner(): boolean {
    return this.ownerId && this.ownerId !== '';
  }

  public hasDevice(): boolean {
    return this.deviceId && this.deviceId !== '';
  }
}
