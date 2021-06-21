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
;
var Web2DColor = /** @class */ (function () {
    function Web2DColor(a, r, g, b) {
        this.color.a = a;
        this.color.b = b;
        this.color.g = g;
        this.color.r = r;
    }
    Web2DColor.prototype.getRgb = function () {
        return "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
    };
    Web2DColor.prototype.getHex = function () {
        return "#" + this.color.r.toString(16) + this.color.g.toString(16) + this.color.b.toString(16);
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
    function Web2DCanvas(context) {
        this.ctx = context;
    }
    return Web2DCanvas;
}());
var Web2D = /** @class */ (function () {
    function Web2D(canvas) {
        this._initSettings = {
            FullScreen: true,
            Parent: document.body,
            Append: true,
            FramesRate: 60
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
        window.addEventListener('resize', function () {
            _this.onresize();
        });
        window.addEventListener('focus', function () {
            _this.onresume();
        });
        window.addEventListener('blur', function () {
            _this.onpause();
        });
        if (settings.FullScreen) {
            this.canvas.width = (settings === null || settings === void 0 ? void 0 : settings.Parent.clientWidth) | document.body.clientWidth;
            this.canvas.height = (settings === null || settings === void 0 ? void 0 : settings.Parent.clientHeight) | document.body.clientHeight;
        }
        else if (settings.Size) {
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
    Web2D.prototype.update = function (deltatime) {
    };
    Web2D.prototype.draw = function (ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    };
    Test2d.prototype.update = function (deltatime) {
        _super.prototype.update.call(this, deltatime);
    };
    return Test2d;
}(Web2D));
window.onload = function () {
    var canvas = document.createElement("canvas");
    var game = new Test2d(canvas);
    game.init();
    game.start();
};
//# sourceMappingURL=app.js.map