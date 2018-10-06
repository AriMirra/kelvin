export class ReportParameters {
  public static empty(): ReportParameters {
    return new ReportParameters('', '', '');
  }

  constructor(private vehicleId: string,
              private from: string,
              private to: string) {}


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
