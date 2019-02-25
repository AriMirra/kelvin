import {Coordinate} from './Coordinate';

/**
 * Model that represents the information of a point which contains:
 *
 * @param {boolean} lighted
 * @param {number} speed
 * @param {number} temperature
 * @param {number} humidity
 * @param {number[]} time
 * @param {Coordinate} coordinates
 */
export class PointInfo {
  public static empty(): PointInfo {
    return new PointInfo(false, 0, 0, 0, [], null);
  }

  constructor(public lighted: boolean,
              public speed: number,
              public temperature: number,
              public humidity: number,
              public time: number[],
              public coordinates: Coordinate) {
  }

  public asJson() {
    return {
      lighted: this.lighted,
      speed: this.speed,
      temperature: this.temperature,
      humidity: this.humidity,
      time: this.time,
      coordinates: this.coordinates.asJson()
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }

  /**
   * Method the returns a new date from the point info time.
   *
   * @returns {Date}
   */
  get dateTime(): Date {
    return new Date(this.time[0], this.time[1], this.time[2] + 1, this.time[3], this.time[4], this.time[5]);
  }

}
