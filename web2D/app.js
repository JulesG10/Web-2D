var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Web2DColor = /** @class */ (function () {
    function Web2DColor(a, r, g, b) {
        if (a === void 0) { a = 255; }
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        this.color = { a: 255, r: 0, g: 0, b: 0 };
        this.color.a = a;
        this.color.b = b;
        this.color.g = g;
        this.color.r = r;
    }
    Web2DColor.prototype.getRgb = function () {
        return ("rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")");
    };
    Web2DColor.prototype.getHex = function () {
        return ("#" +
            this.color.r.toString(16) +
            this.color.g.toString(16) +
            this.color.b.toString(16));
    };
    return Web2DColor;
}());
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
var Web2DCanvas = /** @class */ (function () {
    function Web2DCanvas() {
    }
    Web2DCanvas.prototype.setColor = function (ctx, color) {
        ctx.fillStyle = color.getRgb();
    };
    Web2DCanvas.prototype.getColor = function (ctx) {
        var rgbStr = ctx.fillStyle.toString().replace("rgb(", "").replace(")", "");
        var colorStr = rgbStr.split(",");
        return new Web2DColor(255, parseInt(colorStr[0]), parseInt(colorStr[1]), parseInt(colorStr[2]));
    };
    Web2DCanvas.prototype.clear = function (ctx, size) {
        var last = this.getColor(ctx);
        this.setColor(ctx, new Web2DColor(255, 0, 0, 0));
        ctx.fillRect(0, 0, size.Width, size.Height);
        this.setColor(ctx, last);
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
        this.web2dCanvas.setColor(this.ctx, new Web2DColor(255, 0, 0, 0));
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
var Test2d = /** @class */ (function (_super) {
    __extends(Test2d, _super);
    function Test2d(canvas) {
        return _super.call(this, canvas) || this;
    }
    Test2d.prototype.draw = function (ctx) {
        _super.prototype.draw.call(this, ctx);
        this.animation.draw(ctx);
    };
    Test2d.prototype.createAnimation = function (src, sec_delay) {
        this.animation = new Web2DAnimation(src, { X: 0, Y: 0 }, { Width: 50, Height: 50 }, sec_delay / 1000);
    };
    Test2d.prototype.update = function (deltatime) {
        _super.prototype.update.call(this, deltatime);
        this.animation.update(deltatime);
    };
    return Test2d;
}(Web2D));
window.onload = function () {
    var canvas = document.createElement("canvas");
    var assets = ["https://i.pinimg.com/736x/ed/a5/d5/eda5d54ab0a23440232ca68114645dce--tableau-design-roy-lichtenstein.jpg", "https://i.pinimg.com/originals/26/76/3d/26763d481172f5dc599d151570b38ded.jpg", "https://s1.piq.land/2012/03/30/NYT7ph1dRivUBnXF6HJEMAlD_400x400.png"];
    var sources = [];
    for (var i = 0; i < assets.length; i++) {
        var img = document.createElement("img");
        img.src = assets[i];
        img.style.display = "none";
        sources.push(img);
        document.body.appendChild(img);
    }
    var game = new Test2d(canvas);
    game.init();
    game.createAnimation(sources, 0.1);
    game.start();
};
//# sourceMappingURL=app.js.map