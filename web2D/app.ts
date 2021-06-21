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
  Focus?: boolean;
}

interface Web2DARGB {
  a: number;
  r: number;
  g: number;
  b: number;
}

class Web2DObject {
  public size: Web2DSize;
  public position: Web2DVector2;
  public texture: CanvasImageSource;

    public distance(obj: Web2DObject): number {
        return Math.pow((obj.position.X - this.position.X), 2) + Math.pow((obj.position.Y - this.position.Y), 2);
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

    public update(deltatime: number) {

    }

    public draw(ctx: CanvasRenderingContext2D) {

    }
}

class Web2DAnimation {
  private index: number = 0;
  private textures: CanvasImageSource[];
  private position: Web2DVector2;
  private size: Web2DSize;
  private delay: number = 0;
  private time: number = 0;

  constructor(
    textures: CanvasImageSource[],
    position: Web2DVector2 = { X: 0, Y: 0 },
    size: Web2DSize = { Width: 0, Height: 0 },
    delay: number = 0
  ) {
    this.textures = textures;
    this.position = position;
    this.size = size;
    this.delay = delay;
  }

  public update(deltatime: number) {
    this.time += deltatime;
    if (this.time > this.delay) {
      this.time = 0;
      this.index++;
      if (this.index >= this.textures.length) {
        this.index = 0;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.size.Width && !this.size.Height) {
      ctx.drawImage(
        this.textures[this.index],
        this.position.X,
        this.position.Y
      );
    } else {
      ctx.drawImage(
        this.textures[this.index],
        this.position.X,
        this.position.Y,
        this.size.Width,
        this.size.Height
      );
    }
  }
}

class Web2DCanvas {
  constructor() {}

  public clear(ctx: CanvasRenderingContext2D, size: Web2DSize): void {
    ctx.clearRect(0, 0, size.Width, size.Height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size.Width, size.Height);
  }

  public line(
    ctx: CanvasRenderingContext2D,
    color: string,
    point1: Web2DVector2,
    point2: Web2DVector2,
    width: number = 1
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(point1.X, point1.Y);
    ctx.lineTo(point2.X, point2.Y);
    ctx.stroke();
    ctx.closePath();
  }

  public pixel(
    ctx: CanvasRenderingContext2D,
    r: number,
    g: number,
    b: number,
    a: number,
    point: Web2DVector2
  ) {
    let id = ctx.createImageData(1, 1);
    let d = id.data;
    d[0] = r;
    d[1] = g;
    d[2] = b;
    d[3] = a;
    ctx.putImageData(id, point.X, point.Y);
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
    Focus: false,
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
    if (this.initSettings.Focus) {
      window.addEventListener("focus", () => {
        this.onresume();
      });

      window.addEventListener("blur", () => {
        this.onpause();
      });
    }

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
