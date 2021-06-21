# Simple Web 2d Engine

Add app.js before your scripts files
```html
<head>
    <meta charset="utf-8" />
    <title>Web2D</title>
    <script src="app.js" type="text/javascript"></script> <!-- app.js first  -->
    <script src="test.js" type="text/javascript"></script><!-- test game after -->
</head>
```

Test class example
```javascript
class Test2d extends Web2D {
  constructor(canvas) {
    super(canvas);
    this.position = { X: 0, Y: 100 };
  }

  draw(ctx) {
    super.draw(ctx);
    this.drawObject(ctx);
  }

  drawObject(ctx) {
    web2dCanvas.pixel(ctx, 255, 0, 0, 255, this.position);
  }

  update(deltatime) {
    super.update(deltatime);
    this.position.X += 50 * deltatime;
  }
}

const game = new Test2d(canvas);
game.init();
game.start();
```
