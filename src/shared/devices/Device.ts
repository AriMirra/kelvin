export class Device {
  public static empty(): Device {
    return new Device('', '', '', false);
  }

  constructor(private id: string,
              private mac: string,
              private alias: string,
              private assigned: boolean) {}


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
