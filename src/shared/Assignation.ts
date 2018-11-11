/**
 * Model that represents the pairing between an user and a vehicle.
 */
export class Assignation {

    public static empty(): Assignation {
        return new Assignation('', '', '', '', '', false);
    }

    constructor(private id: string,
                private deviceId: string,
                private vehicleId: string,
                private assignDate: string,
                private deassignDate: string,
                private active: boolean) {
    }

    public asJson() {
        return {
            id: this.id,
            deviceId: this.deviceId,
            vehicleId: this.vehicleId,
            assignDate: this.assignDate,
            deassignDate: this.deassignDate,
            active: this.active
        };
    }

    public asJsonString(): string {
        return JSON.stringify(this.asJson());
    }

}
