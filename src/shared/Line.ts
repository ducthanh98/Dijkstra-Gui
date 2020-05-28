import { Point } from './Point';

export class Line {
    start: Point;
    end: Point;
    hightlight: boolean = false;
    length: number = 0;

    constructor(start: Point, end: Point, length: number) {
        this.start = start;
        this.end = end;
        this.length = length;
    }
}