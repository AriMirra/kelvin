/**
 * Model that represents a coordinate which contains:
 *
 * @param {string} lat
 * @param {string} lon
 */
export class Coordinate {

    public static empty(): Coordinate {
        return new Coordinate('', '');
    }

    constructor(public lat: string,
                public lon: string) {
    }

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
