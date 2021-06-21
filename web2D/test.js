class Test2d extends Web2D {

    constructor(canvas) {
        super(canvas);
        this.animation = undefined;
    }

    draw(ctx) {
        super.draw(ctx);
        this.animation.draw(ctx);
        this.web2dCanvas.line(ctx, "blue", { X: 600, Y: 600 }, { X: 700, Y: 700 });

        this.web2dCanvas.pixel(ctx, 255, 0, 0, 255, { X: 100, Y: 100 });
    }

    createAnimation(src, sec_delay) {
        this.animation = new Web2DAnimation(
            src,
            { X: 0, Y: 0 },
            { Width: 400, Height: 400 },
            sec_delay / 1000
        );
    }

    update(deltatime) {
        super.update(deltatime);
        this.animation.update(deltatime);
    }
}

const ASSETS = [
    { url: "https://i.pinimg.com/736x/ed/a5/d5/eda5d54ab0a23440232ca68114645dce--tableau-design-roy-lichtenstein.jpg", id: "" },
    { url: "https://i.pinimg.com/originals/26/76/3d/26763d481172f5dc599d151570b38ded.jpg", id: "" },
    { url: "https://s1.piq.land/2012/03/30/NYT7ph1dRivUBnXF6HJEMAlD_400x400.png", id: "" },
];

function loadAssets(assets) {
    let sources = [];
    for (let i = 0; i < assets.length; i++) {
        let img = document.createElement("img");
        img.src = assets[i].url;
        img.id = assets[i].id;
        img.style.display = "none";
        sources.push(img);
        document.body.appendChild(img);
    }

    return sources;
}

window.onload = () => {
    const canvas = document.createElement("canvas");
    let sources = loadAssets(ASSETS);
    const game = new Test2d(canvas);
    game.init();
    game.createAnimation(sources, 0.1);
    game.start();
};