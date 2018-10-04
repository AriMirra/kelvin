export class DeviceCredentials {
  public static empty(): DeviceCredentials {
    return new DeviceCredentials( '', '');
  }

  constructor(private mac: string,
              private alias: string) {}

  public asJson() {
    return {
      mac: this.mac,
      alias: this.alias,
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }
}
