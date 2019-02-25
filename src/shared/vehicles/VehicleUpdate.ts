import {Vehicle} from './Vehicle';

/**
 * Model that represents the update of a vehicle's data.
 */
export class VehicleUpdate {

  public static empty(): VehicleUpdate {
    return new VehicleUpdate('', '', 0, '', '');
  }

  public static for(vehicle: Vehicle): VehicleUpdate {
    return new VehicleUpdate(vehicle.ownerId, vehicle.domain, vehicle.wheels, vehicle.brand, vehicle.model);
  }

  constructor(public ownerId: string,
              public domain: string,
              public wheels: number,
              public brand: string,
              public model: string) {
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
