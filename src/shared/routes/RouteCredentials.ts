/**
 * Model that represents the credentials of a route.
 */
export class RouteCredentials {

    public static empty(): RouteCredentials {
        return new RouteCredentials('', '', '', '', '', 0, 0, 0, 0, false);
    }

    constructor(public name: string,
                public productId: string,
                public vehicleId: string,
                public from: string,
                public to: string,
                public minTemperature: number,
                public maxTemperature: number,
                public minHumidity: number,
                public maxHumidity: number,
                public vampire: boolean) {
    }

    public asJson() {
        return {
            name: this.name,
            productId: this.productId,
            vehicleId: this.vehicleId,
            from: this.from,
            to: this.to,
            minTemperature: this.minTemperature,
            maxTemperature: this.maxTemperature,
            minHumidity: this.minHumidity,
            maxHumidity: this.maxHumidity,
            vampire: this.vampire
        };
    }

    public asJsonString(): string {
        return JSON.stringify(this.asJson());
    }

}
