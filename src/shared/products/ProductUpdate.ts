import {Product} from './Product';

/**
 * Model that represents the update of a product's data.
 */
export class ProductUpdate {

    public static empty(): ProductUpdate {
        return new ProductUpdate('', 0, 0, 0, 0, false);
    }

    public static for(product: Product): ProductUpdate {
        return new ProductUpdate(
            product.name,
            product.minTemperature,
            product.maxTemperature,
            product.minHumidity,
            product.maxHumidity,
            product.vampire);
    }

    constructor(public name: string,
                public minTemperature: number,
                public maxTemperature: number,
                public minHumidity: number,
                public maxHumidity: number,
                public vampire: boolean) {
    }

    public asJson() {
        return {
            name: this.name,
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
