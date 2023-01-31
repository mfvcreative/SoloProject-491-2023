





class DemoScene extends Scene {
    constructor() {
        super()
        this.projectileSystem = new ProjectileSystem(this.entityManager)
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities)
        this.lifeSpanSystem = new LifespanSystem(this.entityManager.getEntities)
        this.enemySystem = new EnemyStateSystem(this.entityManager.getEntities)
    }

    init() {
        demoTileMapEntity(this.entityManager)
        this.player = playerEntity(this.entityManager)

        //map entities
        mapEntities(this.entityManager, collisionMap, collisionBox)
        mapEntities(this.entityManager, healthBarMapping, healthBarSegment)
        mapEntities(this.entityManager, armorBarMapping,armorBarSegment)
        mapEntities(this.entityManager, weaponSlotsMapping, weaponSlot)
        this.playerInput = new PlayerInputSystem(this.player)
        this.enemy = zombieEnemyEntity(this.entityManager)
    }

    update(click, mouseDown, mouse, wheel, keys, tick) {
        this.entityManager.update()
        this.collisionSystem.update(tick)
        this.playerInput.update(keys, mouseDown, mouse, tick)
        this.enemySystem.update(tick)
        this.projectileSystem.update(tick, mouseDown, mouse, this.player)
        this.lifeSpanSystem.update(tick)
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
            } if(e.tag === 'enemy') {
                ctx.beginPath()
                ctx.fillStyle = rgba(0, 0, 255, .5)
                ctx.arc(e.components.fieldOfSight.x, e.components.fieldOfSight.y, e.components.fieldOfSight.radius, 0, 2 * Math.PI)
                ctx.fill()
            }
        })
    }
}