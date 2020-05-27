import { Injectable } from '@angular/core';
import { Point } from 'src/shared/Point';
import { Config } from 'src/shared/Config';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }


  generatePoints(numberPoint: number) {
    const points : Point[]= [];

    for (let i = 0; i < numberPoint; i++) {

      const point: Point = new Point();

      while (1) {
        const tmp = this.randomValue(Config.width - Config.radius);

        if (tmp > Config.radius) {

          point.x = tmp;
          break;

        }

      }

      while (1) {
        const tmp = this.randomValue(Config.height - Config.radius);

        if (tmp > Config.radius) {

          point.y = tmp;
          break;

        }

      }

      points.push(point);

    }

    return points;

  }

  private randomValue(value) {
    return Math.round(Math.random() * value);
  }
}
