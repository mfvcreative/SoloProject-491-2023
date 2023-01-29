





class DemoScene extends Scene {
    constructor() {
        super()
        this.projectileSystem = new ProjectileSystem(this.entityManager)
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities)
        this.lifeSpanSystem = new LifespanSystem(this.entityManager.getEntities)
        this.enemySystem = new EnemyStateSystem(this.entityManager.getEntities)
    }

    init() {
        let e = demoTileMapEntity(this.entityManager)
        this.player = playerEntity(this.entityManager)
        let r = this.#makeCollisionMap(collisionMap)
        this.playerInput = new PlayerInputSystem(this.player)
        this.enemy = zombieEnemyEntity(this.entityManager)
    }

    update(input, mouse, mouseDown, tick) {
        this.entityManager.update()
        this.collisionSystem.update(tick)
        this.playerInput.update(input, mouse, tick)
        this.enemySystem.update(tick)
        if(mouseDown) {
            this.projectileSystem.spawnBullet(mouse, this.player)
        } else {
            this.projectileSystem.ready()
        } 
        this.projectileSystem.update(tick)
        this.lifeSpanSystem.update(tick)
        console.log(this.enemy.components.health.currentHealth)
    }

    draw(ctx) {
        this.renderSystem.draw(ctx)
        /* drawing colliders for debug
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
            } if(e.tag === 'enemy') {
                ctx.beginPath()
                ctx.fillStyle = rgba(0, 0, 255, .5)
                ctx.arc(e.components.fieldOfSight.x, e.components.fieldOfSight.y, e.components.fieldOfSight.radius, 0, 2 * Math.PI)
                ctx.fill()
            }
        })
        */
    }

    #makeCollisionMap(data) {
        let result = []
        for(let i = 0; i < data.length; i += 32) {
            result.push(data.slice(i, 32 + i))
        }
        result.forEach((row, y) => {
            row.forEach((e, x) => {
                if(e !== 0) {
                    let props = {
                        x: x * BLOCK_SIZE,
                        y: y * BLOCK_SIZE
                    }
                    collisionBox(this.entityManager, props)
                }
            })
        })
    }
}