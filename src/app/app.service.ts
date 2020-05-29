import { Injectable } from '@angular/core';
import { Point } from '../shared/Point';
import { Config } from '../shared/Config';
import { Line } from '../shared/Line';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private points: Point[] = [];
  private lines: Line[] = [];
  private matrix = [];
  private paths = [];


  constructor() { }

  getPaths() {
    return this.paths;
  }

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
        let sizeError = false;

        for (let j = 0; j < points.length; j++) {

          if(Math.abs(points[j].x - tmp) < 4*Config.radius){
            sizeError = true;
            break;
          }

        }

        if(sizeError) continue;

        if (tmp > Config.radius) {

          point.x = tmp;
          break;

        }

      }

      while (1) {
        const tmp = this.randomValue(Config.height - Config.radius);

        let sizeError = false;

        for (let j = 0; j < points.length; j++) {

          if(Math.abs(points[j].y - tmp) < 4*Config.radius){
            sizeError = true;
            break;
          }

        }

        if(sizeError) continue;

        if (tmp > Config.radius) {

          point.y = tmp;
          break;

        }

      }

      points.push(point);

    }

    this.points = points;
    console.log(points);
    

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

        if (x == y) continue;

        if (this.matrix[y][x] != 0 && this.matrix[x][y] == 0) {

          this.matrix[x][y] = this.matrix[y][x];
          this.lines.push(new Line(this.points[x], this.points[y], this.matrix[y][x]));


          break;

        } else if (this.matrix[x][y] == 0) {

          const value = this.randomValue(10, true);

          this.matrix[x][y] = value;
          this.lines.push(new Line(this.points[x], this.points[y], value));


          break;

        }


      }

    }

  }

  dijkstra(numberPoint, start, end) {
    this.paths = [];
    let isExist = false;
    let index = start;

    const back = new Array(numberPoint).fill(-1);
    const weight = new Array(numberPoint).fill(Number.MAX_VALUE);
    const visited = new Array(numberPoint).fill(0);


    back[start] = 0;
    weight[start] = 0;

    let connect = -1;


    while (1) {
      connect = -1;

      let min = Number.MAX_VALUE;

      for (let i = 0; i < numberPoint; i++) {
        if (visited[i] == 0) {

          if (this.matrix[start][i] != 0 && weight[i] > weight[start] + this.matrix[start][i]) {

            weight[i] = weight[start] + this.matrix[start][i];
            back[i] = start;

          }

          if (min > weight[i]) {
            min = weight[i];
            connect = i;
          }

        }

      }

      start = connect;
      visited[start] = 1;

      if (start == end) {
        isExist = true;
        break;
      }

      if (connect == -1) {
        break;
      }
    }


    if (isExist) {
      console.log('end', weight[end])

      this.printPath(index, end, back)

    }
    return weight[end];

  }

  printPath(start, finish, back) {

    if (start == finish) {

      this.paths.push(finish)

    } else if (finish == -1) {
      return;
    }
    else {

      this.printPath(start, back[finish], back)
      this.paths.push(finish)

    }

  }

  private randomValue(value, isFloor = false) {

    if (isFloor) {


      while (1) {

        const tmp = Math.floor(Math.random() * value);

        if (!tmp) continue;

        return tmp;

      }


    }

    return Math.round(Math.random() * value);
  }
}
