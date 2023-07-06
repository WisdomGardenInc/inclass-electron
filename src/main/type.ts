export default class Event {
  public defaultPrevented = false;

  public preventDefault(): void {
    this.defaultPrevented = true;
  }
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Display {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenshotsData {
  bounds: Bounds;
  display: Display;
}
