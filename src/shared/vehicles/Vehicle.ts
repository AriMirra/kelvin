/**
 * Model that represents a vehicle which contains:
 *
 * @param {string} id
 * @param {string} ownerId
 * @param {string} domain
 * @param {number} wheels
 * @param {string} brand
 * @param {string} model
 * @param {string} deviceId
 */
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
                public deviceId: string) {
    }

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

    /**
     * Method that returns true if the vehicle has an owner.
     *
     * @returns {boolean}
     */
    public hasOwner(): boolean {
        return this.ownerId && this.ownerId !== '';
    }

    /**
     * Method that returns true if the vehicle has a paired device.
     *
     * @returns {boolean}
     */
    public hasDevice(): boolean {
        return this.deviceId && this.deviceId !== '';
    }

}
