import {Coordinate} from './Coordinate';

export class Point {
  public static empty(): Point {
    return new Point(false, 0, 0, 0, '', null);
  }

  constructor(private lighted: boolean,
              private speed: number,
              private temperature: number,
              private humidity: number,
              private time: string,
              private coordinates: Coordinate) {}


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
