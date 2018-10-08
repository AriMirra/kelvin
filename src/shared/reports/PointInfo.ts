import {Coordinate} from './Coordinate';

export class PointInfo {
  public static empty(): PointInfo {
    return new PointInfo(false, 0, 0, 0, '', null);
  }

  constructor(public lighted: boolean,
              public speed: number,
              public temperature: number,
              public humidity: number,
              public time: string,
              public coordinates: Coordinate) {}


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
}
