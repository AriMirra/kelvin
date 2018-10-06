import {Point} from './Point';

export class Report {
  public static empty(): Report {
    return new Report('', '', null);
  }

  constructor(private id: string,
              private mac: string,
              private pointInfo: Point) {}


  public asJson() {
    return {
      id: this.id,
      mac: this.mac,
      pointInfo: this.pointInfo.asJson()
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }
}
