interface Web2DSize {
  Width: number;
  Height: number;
}

interface Web2DVector2 {
  X: number;
  Y: number;
}

interface Web2DInitSettings {
  FullScreen: boolean;
  Size?: Web2DSize;
  Parent?: HTMLElement;
  Append?: boolean;
  FramesRate?: number;
}

interface Web2DARGB {
  a: number;
  r: number;
  g: number;
  b: number;
}

class Web2DColor {
  public color: Web2DARGB;

  constructor(a, r, g, b) {
    this.color.a = a;
    this.color.b = b;
    this.color.g = g;
    this.color.r = r;
  }

  public getRgb(): string {
    return (
      "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")"
    );
  }

  public getHex() {
    return (
      "#" +
      this.color.r.toString(16) +
      this.color.g.toString(16) +
      this.color.b.toString(16)
    );
  }
}

class Web2DObject {
  public size: Web2DSize;
  public position: Web2DVector2;
  public texture: CanvasImageSource;

  public distance(obj: Web2DObject): number {
    return 0;
  }

  public collisionAABB(obj: Web2DObject): boolean {
    if (
      this.position.X < obj.position.X + obj.size.Width &&
      this.position.X + this.size.Width > obj.position.X &&
      this.position.Y < obj.position.Y + obj.size.Height &&
      this.size.Height + this.position.Y > obj.position.Y
    ) {
      return true;
    }
    return false;
  }
}

class Web2DAnimation {
  private index: number = 0;
  private textures: CanvasImageSource[];
  private position: Web2DVector2;
  private size: Web2DSize;
  private delay: number;
  private time: number;

  constructor(
    textures: CanvasImageSource[],
    position: Web2DVector2,
    size: Web2DSize,
    delay: number
  ) {
    this.textures = textures;
    this.position = position;
    this.size = size;
    this.delay = delay;
  }

  public update(deltatime: number) 
  {
      this.time += deltatime;
      if(this.time > this.delay)
      {
          this.time = 0;
          this.index++;
          if(this.index > this.textures.length)
          {
              this.index = 0;
          }
      }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.textures[this.index],
      this.position.X,
      this.position.Y,
      this.size.Width,
      this.size.Height
    );
  }
}

interface Web2DPathPoint {
  id: number;
  position: Web2DVector2;
}

/*
class Web2DRect {

}

class Web2DCircle {

}

class Web2DTriangle {

}

class Web2DPath {

}
*/

class Web2DCanvas {
  constructor() {}

  public setColor(ctx: CanvasRenderingContext2D, color: Web2DColor) {
    ctx.fillStyle = color.getRgb();
  }

  public getColor(ctx: CanvasRenderingContext2D): Web2DColor {
    let rgbStr = ctx.fillStyle.toString().replace("rgb(", "").replace(")", "");
    let colorStr = rgbStr.split(",");
    return new Web2DColor(
      255,
      parseInt(colorStr[0]),
      parseInt(colorStr[1]),
      parseInt(colorStr[2])
    );
  }

  public clear(ctx: CanvasRenderingContext2D, size: Web2DSize): void {
    let last: Web2DColor = this.getColor(ctx);
    this.setColor(ctx, new Web2DColor(255, 0, 0, 0));
    ctx.fillRect(0, 0, size.Width, size.Height);
    this.setColor(ctx, last);
  }
}

class Web2D {
  private ctx: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  protected web2dCanvas: Web2DCanvas = new Web2DCanvas();
  private _initSettings: Web2DInitSettings = {
    FullScreen: true,
    Parent: document.body,
    Append: true,
    FramesRate: 60,
  };

  protected get initSettings(): Web2DInitSettings {
    return this._initSettings;
  }

  private intervalId: number;

  private _isRunning: boolean = false;
  protected get isRunning(): boolean {
    return this._isRunning;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public init(settings: Web2DInitSettings = this.initSettings): void {
    window.addEventListener("resize", () => {
      this.onresize();
    });

    window.addEventListener("focus", () => {
      this.onresume();
    });

    window.addEventListener("blur", () => {
      this.onpause();
    });

    if (settings.FullScreen) {
      this.canvas.width =
        settings?.Parent.clientWidth | document.body.clientWidth;
      this.canvas.height =
        settings?.Parent.clientHeight | document.body.clientHeight;
    } else if (settings.Size) {
      this.canvas.width = settings.Size.Width;
      this.canvas.height = settings.Size.Height;
    }

    if (settings.Append && settings.Parent) {
      settings.Parent.appendChild(this.canvas);
    }
    this._initSettings = settings;
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error(
        "Unable to initialize 2d context. Your browser or machine may not support it."
      );
    }
  }

  public start() {
    if (!this.isRunning) {
      this._isRunning = true;
      let start = window.performance.now();
      this.intervalId = setInterval(() => {
        if (this.isRunning) {
          let deltatime = (window.performance.now() - start) * Math.pow(10, -6);
          start = window.performance.now();

          this.update(deltatime);
          this.draw(this.ctx);
        }
      }, 1000 / this.initSettings.FramesRate);
    }
  }

  public onresize() {
    if (this.initSettings.FullScreen) {
      this.canvas.width =
        this.initSettings.Parent.clientWidth | document.body.clientWidth;
      this.canvas.height =
        this.initSettings.Parent.clientHeight | document.body.clientHeight;
      if (this.initSettings.Append && this.initSettings.Parent) {
        this.initSettings.Parent.removeChild(this.canvas);
        this.initSettings.Parent.appendChild(this.canvas);

        if (this.isRunning) {
          this.draw(this.ctx);
        }
      }
    }
  }

  public onpause() {
    this._isRunning = false;
  }

  public onresume() {
    this._isRunning = true;
  }

  public stop() {
    clearInterval(this.intervalId);
    this._isRunning = false;
  }

  public update(deltatime: number): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    let size: Web2DSize = {
      Width: this.canvas.width,
      Height: this.canvas.height,
    };
    this.web2dCanvas.clear(this.ctx, size);
  }
}

class Test2d extends Web2D {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }

  public update(deltatime: number): void {
    super.update(deltatime);
  }
}

window.onload = () => {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const game = new Test2d(canvas);
  game.init();
  game.start();
};
