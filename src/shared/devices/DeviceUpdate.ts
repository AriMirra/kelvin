import {Device} from './Device';

export class DeviceUpdate {

  public static empty(): DeviceUpdate {
    return new DeviceUpdate('', '');
  }

  public static for(device: Device): DeviceUpdate {
    return new DeviceUpdate(device.alias, device.mac);
  }

  constructor(public alias: string, public mac: string) {
  }


  public asJson() {
    return {
      alias: this.alias,
      mac: this.mac
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}
