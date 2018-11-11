/**
 * Model that represents a device which contains:
 *
 * @param {string} id
 * @param {string} mac
 * @param {string} alias
 * @param {boolean} assigned
 */
export class Device {

    public static empty(): Device {
        return new Device('', '', '', false);
    }

    constructor(public id: string,
                public mac: string,
                public alias: string,
                public assigned: boolean) {
    }

    public asJson() {
        return {
            id: this.id,
            mac: this.mac,
            alias: this.alias,
            assigned: this.assigned
        };
    }

    public asJsonString(): string {
        return JSON.stringify(this.asJson());
    }

}
