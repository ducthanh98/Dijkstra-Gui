import { Component, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Point } from '../shared/Point';
import { AppService } from './app.service';

import { ArrowConfig } from 'konva/types/shapes/Arrow';
import { CircleConfig } from 'konva/types/shapes/Circle';
import { TextConfig } from 'konva/types/shapes/Text';

import { Config } from '../shared/Config';
import { Line } from 'src/shared/Line';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'Paths';
  points: BehaviorSubject<CircleConfig>[] = [];
  textPoint: Point[] = [];
  lines: BehaviorSubject<ArrowConfig>[] = [];
  textLength: Line[] = [];
  input = {
    line: 0,
    point: 0
  }

  isLoading = true;
  selected = [];
  result = 0;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void { }

  public configStage = new BehaviorSubject({
    width: Config.width,
    height: Config.height
  });


  drawPoints() {
    this.points = [];
    const tmp = this.appService.getPoints();
    this.textPoint = this.appService.getPoints();

    for (let i = 0; i < tmp.length; i++) {

      this.points.push(new BehaviorSubject({
        x: tmp[i].x,
        y: tmp[i].y,
        radius: Config.radius,
        fill: tmp[i].highlight ? 'red' : 'white',
        stroke: 'black',
        strokeWidth: 2,
      }))

    }

  }

  drawLines() {
    this.lines = [];
    const tmp = this.appService.getLines();
    this.textLength = this.appService.getLines();

    for (let i = 0; i < tmp.length; i++) {
      const config: ArrowConfig = {
        points: [
          this.choosePointToDrawLine(tmp[i].start.x, tmp[i].end.x),
          this.choosePointToDrawLine(tmp[i].start.y, tmp[i].end.y),
          this.choosePointToDrawLine(tmp[i].end.x, tmp[i].start.x),
          this.choosePointToDrawLine(tmp[i].end.y, tmp[i].start.y),
        ],
        pointerAtBeginning: false,
        stroke: 'black',
        strokeWidth: 2,
        fill: tmp[i].hightlight ? 'red' : 'black'
      }

      this.lines.push(new BehaviorSubject(config));

    }


  }

  choosePointToDrawLine(first: number, second: number) {
    if (first< second && second - first < 3 * Config.radius) {

      return first;

    }
    else if (first < second) {

      return first + Config.radius;

    } else {

      return first - Config.radius

    }


  }

  configTextPoint(point: Point, index: string) {
    const config: TextConfig = {
      x: index.toString().length === 1 ? point.x - 4 : point.x - 7,
      y: point.y - 5,
      text: index,
    }

    return of(config);
  }

  configTextLength(line: Line) {
    const config: TextConfig = {
      x: (line.start.x + line.end.x) / 2 + 18,
      y: (line.start.y + line.end.y) / 2 + 18,
      text: line.length.toString(),
    }

    return of(config);
  }

  onSubmit(form: NgForm) {
    if(form.value.line > 399 || form.value.line < 0 || form.value.point < 0 || form.value.point > 20){
      return alert('Invalid value')
    }
    this.result = 0;
    this.selected = [];
    this.isLoading = true;

    this.appService.generatePoints(form.value.point);
    this.drawPoints();


    this.appService.generateLines(form.value);
    this.drawLines();

    setTimeout(() => { this.isLoading = false }, 0)

  }

  handleClickCircle(i) {
    this.result = 0;

    if (!this.selected.includes(i) && this.selected.length == 2) {
      return;
    }


    this.textPoint[i].highlight = !this.textPoint[i].highlight;

    if (this.textPoint[i].highlight) {


      this.selected.push(i);

    } else {

      this.selected.splice(this.selected.indexOf(i), 1)

    }

    this.points[i].next({

      x: this.textPoint[i].x,
      y: this.textPoint[i].y,
      radius: Config.radius,
      fill: this.textPoint[i].highlight ? 'red' : 'white',
      stroke: 'black',
      strokeWidth: 2,

    })



  }

  findPath() {

    for (let j = 0; j < this.textLength.length; j++) {
      this.textLength[j].hightlight = false;

      const config: ArrowConfig = {
        points: [
          this.choosePointToDrawLine(this.textLength[j].start.x, this.textLength[j].end.x),
          this.choosePointToDrawLine(this.textLength[j].start.y, this.textLength[j].end.y),
          this.choosePointToDrawLine(this.textLength[j].end.x, this.textLength[j].start.x),
          this.choosePointToDrawLine(this.textLength[j].end.y, this.textLength[j].start.y),
        ],
        pointerAtBeginning: false,
        stroke: this.textLength[j].hightlight ? 'red' : 'black',
        strokeWidth: 2,
        fill: this.textLength[j].hightlight ? 'red' : 'black'
      }

      this.lines[j].next(config)

    }


    if (this.selected.length != 2) {
      return;
    }

    const result = this.appService.dijkstra(this.input.point, this.selected[0], this.selected[1]);

    const paths = this.appService.getPaths();

    if (paths.length > 0) {
      this.result = result;
    } else {
      return this.result = -1;
    }



    for (let i = 1; i < paths.length; i++) {

      for (let j = 0; j < this.textLength.length; j++) {

        if (
          this.textLength[j].start.x == this.textPoint[paths[i - 1]].x &&
          this.textLength[j].start.y == this.textPoint[paths[i - 1]].y &&
          this.textLength[j].end.x == this.textPoint[paths[i]].x &&
          this.textLength[j].end.y == this.textPoint[paths[i]].y

        ) {

          this.textLength[j].hightlight = true;
          const config: ArrowConfig = {
            points: [
              this.choosePointToDrawLine(this.textLength[j].start.x, this.textLength[j].end.x),
              this.choosePointToDrawLine(this.textLength[j].start.y, this.textLength[j].end.y),
              this.choosePointToDrawLine(this.textLength[j].end.x, this.textLength[j].start.x),
              this.choosePointToDrawLine(this.textLength[j].end.y, this.textLength[j].start.y),
            ],
            pointerAtBeginning: false,
            stroke: this.textLength[j].hightlight ? 'red' : 'black',
            strokeWidth: 4,
            fill: this.textLength[j].hightlight ? 'red' : 'black'
          }

          this.lines[j].next(config)


        }


      }

    }

  }

}
