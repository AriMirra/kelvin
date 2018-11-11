/**
 * Model that represents the credentials of a vehicle.
 */
export class VehicleCredentials {

    public static empty(): VehicleCredentials {
        return new VehicleCredentials('', '', 2, '', '');
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
