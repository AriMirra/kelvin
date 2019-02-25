import {Route} from './Route';

/**
 * Model that represents the update of a product's data.
 */
export class RouteUpdate {

    public static empty(): RouteUpdate {
        return new RouteUpdate('', '', '', '', '', 0, 0, 0, 0, false);
    }

    public static for(route: Route, from: string, to: string): RouteUpdate {
        return new RouteUpdate(
            route.name,
            route.productId,
            route.vehicleId,
            from,
            to,
            route.minTemperature,
            route.maxTemperature,
            route.minHumidity,
            route.maxHumidity,
            route.vampire,
        );
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

    get fromDate(): Date {
        return new Date(this.from);
    }

    get toDate(): Date {
        return new Date(this.to);
    }

    private parseDate(dateArray: number[]): Date {
        return new Date(dateArray[0], dateArray[1], dateArray[2] + 1, dateArray[3], dateArray[4], dateArray[5]);
    }

}
