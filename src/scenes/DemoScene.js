





class DemoScene extends Scene {
    constructor() {
        super()
        this.projectileSystem = new ProjectileSystem(this.entityManager)
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities)
        this.lifeSpanSystem = new LifespanSystem(this.entityManager.getEntities)
        this.spawnSystem = new SpawnSystem(this.entityManager)
        this.paused = false
    }

    init() {
        demoTileMapEntity(this.entityManager)
        this.player = playerEntity(this.entityManager)
        this.UISystem = new UISystem(this.entityManager.getEntities, this.player)
        this.enemySystem = new EnemyStateSystem(this.entityManager.getEntities, this.player)
        //map entities
        mapEntities(this.entityManager, collisionMap, collisionBox)
        playerScore(this.entityManager, {
            x: WIDTH - 150,
            y: 50
        })
        this.playerInput = new PlayerInputSystem(this.player)
        this.spawnSystem.spawn()
        this.spawnSystem.spawn()
        this.UISystem.init(this.entityManager)
    }

    update(click, mouseDown, mouse, wheel, keys, tick) {
        if(this.player.components.health.currentHealth <= 0) {
            this.paused = true
        }
        if(!this.paused) {
            this.entityManager.update()
            this.playerInput.update(keys, mouseDown, mouse, tick)
            this.enemySystem.update(tick)
            this.projectileSystem.update(tick, mouseDown, mouse, this.player)
            this.lifeSpanSystem.update(tick)
            this.collisionSystem.update(tick)
            this.UISystem.update(click, mouse, tick)
            this.spawnSystem.update(tick)
        }
    }

    draw(ctx) {
        this.renderSystem.draw(ctx)
        if(this.paused) {
            ctx.font = ` 50px PressStart2P-Regular`
            ctx.fontSize = 
            ctx.fillStyle = 'red'
            ctx.fillText('Game Over', WIDTH * .5 - 170, HEIGHT * .5)
        }
    }
}