/**
 * Model that represents the parameters of a report.
 */
export class ReportParameters {

    public static empty(): ReportParameters {
        return new ReportParameters(undefined, undefined, undefined);
    }

    constructor(public vehicleId: string,
                public from: string,
                public to: string) {
    }

    public asJson() {
        return {
            vehicleId: this.vehicleId,
            from: this.from,
            to: this.to
        };
    }

    public asJsonString(): string {
        return JSON.stringify(this.asJson());
    }

}
