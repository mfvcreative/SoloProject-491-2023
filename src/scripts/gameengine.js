// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {

        this.ctx = null;
        //used to calculate FPS
        this.renderedFrames = 0
        this.currentTime = 0
        this.lastTime = 0
        this.frames = 0

        //Scenes
        this.demoScene = new DemoScene()


        // Information on the input
        this.click = null;
        this.mouseDown = null;
        this.mouse = {x:0, y: 0};
        this.wheel = null;
        this.uiActive = false;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;

        this.demoScene.init()

        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left - 1,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top - 1
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener('mousedown', e => {
            if (this.options.debugging) {
                console.log("MouseDown", getXandY(e));
            }
            this.mouseDown = true
        })

        this.ctx.canvas.addEventListener('mouseup', e => {
            if (this.options.debugging) {
                console.log("MouseUp", getXandY(e));
            }
            this.mouseDown = false
        })

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });
        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.code === "Tab") {  // PREVENT TABBING OUT
                e.preventDefault();
            }
        });
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.demoScene.draw(this.ctx)
        if(this.options.debugging) {
            this.#debug()
        }
    };

    update() {
        this.demoScene.update(this.keys, this.mouse, this.mouseDown, this.clockTick)
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

    #debug() {
        if(this.currentTime > 1) {
            this.currentTime = 0
            this.frames = this.renderedFrames
            this.renderedFrames = 0
        } else {
            this.currentTime += this.clockTick
            this.renderedFrames++
        }
        this.ctx. textAlign = 'left'
        this.ctx.font = '24px Helvetica'
        this.ctx.fillStyle = 'black'
        this.ctx.fillText(`FPS: ${this.frames}`, 5,24)
    }
}




