import {PointInfo} from './PointInfo';

/**
 * Model that represents a point which contains:
 *
 * @param {string} id
 * @param {string} mac
 * @param {PointInfo} info
 */
export class Point {

  public static empty(): Point {
    return new Point('', '', null);
  }

  public static fromAny(a: any) {
    const info = Object.assign(PointInfo.empty(), a.point);
    return new Point(a.id, a.mac, info);
  }

  constructor(public id: string,
              public mac: string,
              public info: PointInfo) {
  }

  public asJson() {
    return {
      id: this.id,
      mac: this.mac,
      pointInfo: this.info.asJson()
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

}
