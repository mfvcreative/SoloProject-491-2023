





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
        mapEntities(this.entityManager, weaponSlotsMapping, weaponSlot)
        playerScore(this.entityManager, {
            x: WIDTH - 150,
            y: 50
        })
        this.playerInput = new PlayerInputSystem(this.player)
        /*
        this.enemy = zombieEnemyEntity(this.entityManager, {
            x: 200,
            y: 200
        })
        */
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
        }
    }

    draw(ctx) {
        this.renderSystem.draw(ctx)
        // drawing colliders for debug
        this.entityManager.getEntities.forEach(e => {
            if(e.tag === 'collisionBox') {
                ctx.fillStyle = rgba(33,33,33,.5)
                ctx.fillRect(e.components.boxCollider.x, e.components.boxCollider.y, e.components.boxCollider.width, e.components.boxCollider.height)
                ctx.strokeRect(e.components.boxCollider.x, e.components.boxCollider.y, e.components.boxCollider.width, e.components.boxCollider.height)
            } else if(e.tag === 'player' || e.tag === 'enemy') {
                ctx.fillStyle = rgba(255,0,0,.5)
                ctx.beginPath()
                ctx.arc(e.components.circleCollider.x, e.components.circleCollider.y, e.components.circleCollider.radius, 0, 2 * Math.PI)
                ctx.fill()

                ctx.fillStyle = rgb(0,0,0)
                ctx.fillRect(e.components.transform.x, e.components.transform.y, 5,5)
            } if(e.tag === 'enemy') {
                ctx.beginPath()
                ctx.fillStyle = rgba(0, 0, 255, .2)
                ctx.arc(e.components.fieldOfSight.x, e.components.fieldOfSight.y, e.components.fieldOfSight.radius, 0, 2 * Math.PI)
                ctx.fill()
            }
        })
    }
}