import { Point } from './Point';

export class Line {
    start: Point;
    end: Point;
    hightlight: boolean = false;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
}