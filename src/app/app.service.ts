import { Injectable } from '@angular/core';
import { Point } from '../shared/Point';
import { Config } from '../shared/Config';
import { Line } from '../shared/Line';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private points: Point[] = [];
  private lines: Line[] = [];
  private matrix = [];

  constructor() { }


  getPoints() {
    return this.points;
  }

  getLines() {
    return this.lines;
  }


  generatePoints(numberPoint: number) {
    this.initMatrix(numberPoint);

    const points: Point[] = [];

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

    this.points = points;

  }

  initMatrix(numberPoint: number) {
    this.matrix = new Array(numberPoint);

    for (let i = 0; i < this.matrix.length; i++) {
      this.matrix[i] = new Array(numberPoint).fill(0);
    }

  }


  generateLines(value: { point: number, line: number }) {


    this.lines = [];

    for (let i = 0; i < value.line; i++) {

      while (1) {

        const x = this.randomValue(value.point - 1);
        const y = this.randomValue(value.point - 1);

        if (this.matrix[y][x] != 0 && this.matrix[x][y] == 0) {

          this.matrix[x][y] = this.randomValue(10);
          this.lines.push(new Line(this.points[x], this.points[y]));

          break;
          
        } else if(this.matrix[x][y] == 0) {

          
          this.matrix[x][y] = this.matrix[y][x];
          this.lines.push(new Line(this.points[x], this.points[y]));

          break;

        }


      }

    }
    console.log(this.matrix);

  }

  private randomValue(value) {
    return Math.round(Math.random() * value);
  }
}
