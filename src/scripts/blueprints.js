/**
 * Shortcut functions that create premade entities
 */


const playerEntity = (entitymanager) => {
    return entitymanager.addEntity({
        tag: 'player',
        components: [
            new CSprite({
                sprite: ASSET_MANAGER.cache[PLAYER_SPRITE_PATH],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 1.2,
                fps: 1
            }),
            new CTransform({
                x: WIDTH * .5,
                y: HEIGHT * .5
            }),
            new CCircleCollider({
                x: WIDTH * .5,
                y: HEIGHT * .5,
                radius: 16
            }),
            new CHealth(100),
        ]
    })
}

const demoTileMapEntity = (entitymanager) => {
    return entitymanager.addEntity({
        tag: 'tileMap',
        components: [
            new CSprite({
                sprite: ASSET_MANAGER.cache[TILE_MAP_DEMO],
                spriteWidth: WIDTH,
                spriteHeight: HEIGHT,
                scale: 1,
                fps: 1
            }),
            new CTransform({})
        ]
    })
}

const bulletEntity = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'projectile',
        components: [
            new CSprite({
                sprite: ASSET_MANAGER.cache[BULLET_SPRITE_PATH],
                spriteWidth: 5,
                spriteHeight: 5,
                scale: 1.5,
                fps: 1
            }),
            new CTransform({
                x: props.x,
                y: props.y,
                maxVelocity: 1000
            }),
            new CCircleCollider({
                radius: 5
            }),
            new CDamage(2),
            new CLifespan(1)
        ]
    })
}


const collisionBox = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'collisionBox',
        components: [
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE
            })
        ]
    })
}

const zombieEnemyEntity = (entitymanager) => {
    return entitymanager.addEntity({
        tag: 'enemy',
        components: [
            new CSprite({
                sprite: ASSET_MANAGER.cache[COMMON_ZOMBIE_SPRITE_PATH],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 1.4,
                fps: 1
            }),
            new CTransform({
                x: 200,
                y: 200,
                maxVelocity: 60
            }),
            new CCircleCollider({
                x: 200,
                y: 200,
                radius: 16
            }),
            new CHealth(10),
            new CFieldOfSight({
                x: 200,
                y: 200,
                radius: 250
            })
        ]
    })
}