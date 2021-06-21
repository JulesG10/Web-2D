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
};

interface Web2DARGB {
    a: number;
    r: number;
    g: number;
    b: number;
}

class Web2DColor {
    public color: Web2DARGB;

    constructor(a,r,g,b) {
        this.color.a = a;
        this.color.b = b;
        this.color.g = g;
        this.color.r = r;
    }

    public getRgb(): string {
        return "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
    }

    public getHex() {
        return "#" + this.color.r.toString(16) + this.color.g.toString(16) + this.color.b.toString(16);
    }
}


class Web2DObject {
    public size: Web2DSize;
    public position: Web2DVector2;

    public distance(obj: Web2DObject): number {
        return 0;
    }

    public collisionAABB(obj: Web2DObject): boolean {
        if (this.position.X < obj.position.X + obj.size.Width &&
            this.position.X + this.size.Width > obj.position.X &&
            this.position.Y < obj.position.Y + obj.size.Height &&
            this.size.Height + this.position.Y > obj.position.Y) {
            return true;
        }
        return false;
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
    private ctx: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    
}


class Web2D  {
    private ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;
    protected web2dCanvas: Web2DCanvas;
    private _initSettings: Web2DInitSettings = {
        FullScreen: true,
        Parent: document.body,
        Append: true,
        FramesRate: 60
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

        window.addEventListener('resize', () => {
            this.onresize();
        })

        window.addEventListener('focus', () => {
            this.onresume();
        })

        window.addEventListener('blur', () => {
            this.onpause();
        })

        if (settings.FullScreen) {
            this.canvas.width = settings?.Parent.clientWidth | document.body.clientWidth;
            this.canvas.height = settings?.Parent.clientHeight | document.body.clientHeight;
        } else if (settings.Size) {
            this.canvas.width = settings.Size.Width;
            this.canvas.height = settings.Size.Height;
        }

        if (settings.Append && settings.Parent) {
            settings.Parent.appendChild(this.canvas);
        }
        this._initSettings = settings;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Unable to initialize 2d context. Your browser or machine may not support it.");
        }

        this.web2dCanvas = new Web2DCanvas(this.ctx);
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
            this.canvas.width = this.initSettings.Parent.clientWidth | document.body.clientWidth;
            this.canvas.height = this.initSettings.Parent.clientHeight | document.body.clientHeight;
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

    public update(deltatime: number): void {

    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
