import { Component, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Point } from '../shared/Point';
import { Line } from '../shared/Line';
import { AppService } from './app.service';

import { ArrowConfig } from 'konva/types/shapes/Arrow';
import { CircleConfig } from 'konva/types/shapes/Circle';
import { TextConfig } from 'konva/types/shapes/Text';

import { Config } from '../shared/Config';
import { KonvaComponent } from 'ng2-konva';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  @ViewChild('stage', { static: false }) stage: KonvaComponent;
  title = 'Paths';
  isLoading = false;
  points: Point[] = [];
  lines: Line[] = [];
  input = {
    line: 0,
    point: 0
  }


  constructor(private appService: AppService) {
  }

  ngOnInit(): void {



  }

  public configStage = new BehaviorSubject({
    width: Config.width,
    height: Config.height
  });


  configCircle(point: Point): Observable<any> {
    const config: CircleConfig = {
      x: point.x,
      y: point.y,
      radius: Config.radius,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
    }

    return of(config)
  }

  configLine(line: Line): Observable<any> {
    const config: ArrowConfig = {
      points: [
        this.choosePointToDrawLine(line.start.x, line.end.x),
        this.choosePointToDrawLine(line.start.y, line.end.y),
        this.choosePointToDrawLine(line.end.x, line.start.x),
        this.choosePointToDrawLine(line.end.y, line.start.y),
      ],
      pointerAtBeginning: false,
      stroke: 'black',
      strokeWidth: 2,
      fill: 'black'
    }

    return of(config);

  }

  choosePointToDrawLine(first: number, second: number) {

    if (first < second) {
      return first + Config.radius;
    }

    return first - Config.radius

  }

  configText(point: Point, index: string) {
    const config: TextConfig = {
      x: index.length > 1 ? point.x - 6 : point.x - 4,
      y: index.length > 1 ? point.y - 6 : point.y - 4,
      text: index,
    }

    return of(config);
  }

  onSubmit(form: NgForm) {
    this.isLoading = false;

    this.appService.generatePoints(form.value.point);
    this.points = this.appService.getPoints();


    this.appService.generateLines(form.value);
    this.lines = this.appService.getLines();

    setTimeout(() => {
      this.isLoading = true;
    }, 0)

  }

}
