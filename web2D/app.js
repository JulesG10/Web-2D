var Web2DObject = /** @class */ (function () {
    function Web2DObject() {
    }
    Web2DObject.prototype.distance = function (obj) {
        return 0;
    };
    Web2DObject.prototype.collisionAABB = function (obj) {
        if (this.position.X < obj.position.X + obj.size.Width &&
            this.position.X + this.size.Width > obj.position.X &&
            this.position.Y < obj.position.Y + obj.size.Height &&
            this.size.Height + this.position.Y > obj.position.Y) {
            return true;
        }
        return false;
    };
    return Web2DObject;
}());
var Web2DAnimation = /** @class */ (function () {
    function Web2DAnimation(textures, position, size, delay) {
        if (position === void 0) { position = { X: 0, Y: 0 }; }
        if (size === void 0) { size = { Width: 0, Height: 0 }; }
        if (delay === void 0) { delay = 0; }
        this.index = 0;
        this.delay = 0;
        this.time = 0;
        this.textures = textures;
        this.position = position;
        this.size = size;
        this.delay = delay;
    }
    Web2DAnimation.prototype.update = function (deltatime) {
        this.time += deltatime;
        if (this.time > this.delay) {
            this.time = 0;
            this.index++;
            if (this.index >= this.textures.length) {
                this.index = 0;
            }
        }
    };
    Web2DAnimation.prototype.draw = function (ctx) {
        if (!this.size.Width && !this.size.Height) {
            ctx.drawImage(this.textures[this.index], this.position.X, this.position.Y);
        }
        else {
            ctx.drawImage(this.textures[this.index], this.position.X, this.position.Y, this.size.Width, this.size.Height);
        }
    };
    return Web2DAnimation;
}());
var Web2DCanvas = /** @class */ (function () {
    function Web2DCanvas() {
    }
    Web2DCanvas.prototype.clear = function (ctx, size) {
        ctx.clearRect(0, 0, size.Width, size.Height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, size.Width, size.Height);
    };
    Web2DCanvas.prototype.line = function (ctx, color, point1, point2, width) {
        if (width === void 0) { width = 1; }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(point1.X, point1.Y);
        ctx.lineTo(point2.X, point2.Y);
        ctx.stroke();
        ctx.closePath();
    };
    Web2DCanvas.prototype.pixel = function (ctx, r, g, b, a, point) {
        var id = ctx.createImageData(1, 1);
        var d = id.data;
        d[0] = r;
        d[1] = g;
        d[2] = b;
        d[3] = a;
        ctx.putImageData(id, point.X, point.Y);
    };
    return Web2DCanvas;
}());
var Web2D = /** @class */ (function () {
    function Web2D(canvas) {
        this.web2dCanvas = new Web2DCanvas();
        this._initSettings = {
            FullScreen: true,
            Parent: document.body,
            Append: true,
            FramesRate: 60,
            Focus: false,
        };
        this._isRunning = false;
        this.canvas = canvas;
    }
    Object.defineProperty(Web2D.prototype, "initSettings", {
        get: function () {
            return this._initSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Web2D.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        enumerable: false,
        configurable: true
    });
    Web2D.prototype.init = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = this.initSettings; }
        window.addEventListener("resize", function () {
            _this.onresize();
        });
        if (this.initSettings.Focus) {
            window.addEventListener("focus", function () {
                _this.onresume();
            });
            window.addEventListener("blur", function () {
                _this.onpause();
            });
        }
        if (settings.FullScreen) {
            this.canvas.width =
                (settings === null || settings === void 0 ? void 0 : settings.Parent.clientWidth) | document.body.clientWidth;
            this.canvas.height =
                (settings === null || settings === void 0 ? void 0 : settings.Parent.clientHeight) | document.body.clientHeight;
        }
        else if (settings.Size) {
            this.canvas.width = settings.Size.Width;
            this.canvas.height = settings.Size.Height;
        }
        if (settings.Append && settings.Parent) {
            settings.Parent.appendChild(this.canvas);
        }
        this._initSettings = settings;
        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            throw new Error("Unable to initialize 2d context. Your browser or machine may not support it.");
        }
    };
    Web2D.prototype.start = function () {
        var _this = this;
        if (!this.isRunning) {
            this._isRunning = true;
            var start_1 = window.performance.now();
            this.intervalId = setInterval(function () {
                if (_this.isRunning) {
                    var deltatime = (window.performance.now() - start_1) * Math.pow(10, -6);
                    start_1 = window.performance.now();
                    _this.update(deltatime);
                    _this.draw(_this.ctx);
                }
            }, 1000 / this.initSettings.FramesRate);
        }
    };
    Web2D.prototype.onresize = function () {
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
    };
    Web2D.prototype.onpause = function () {
        this._isRunning = false;
    };
    Web2D.prototype.onresume = function () {
        this._isRunning = true;
    };
    Web2D.prototype.stop = function () {
        clearInterval(this.intervalId);
        this._isRunning = false;
    };
    Web2D.prototype.update = function (deltatime) { };
    Web2D.prototype.draw = function (ctx) {
        var size = {
            Width: this.canvas.width,
            Height: this.canvas.height,
        };
        this.web2dCanvas.clear(this.ctx, size);
    };
    return Web2D;
}());
//# sourceMappingURL=app.js.map