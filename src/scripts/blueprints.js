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
            new CHealth(3),
            new CArmor(1),
            new CWeapons(),
            new CScore()
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
                scale: props.size,
                fps: 1
            }),
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CCircleCollider({
                radius: 5
            }),
            new CDamage(props.damage),
            new CLifespan(1)
        ]
    })
}

const dustParticleEntity = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'particle',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: props.velocityX,
                velocityY: props.velocityY
            }),
            new CParticle({
                type: 'dust',
                size: props.size,
                deathSize: props.deathSize,
                decreaseRate: props.decreaseRate,
                color: props.color
            })
        ]
    })
}

const fireParticleEntity = (entitymanager, props) => {
    let type = 'fire'
    return entitymanager.addEntity({
        tag: 'statusEffect',
        components: [
            new CSprite({
                sprite: ASSET_MANAGER.cache[FIRE_PARTICLE_SPRITE],
                spriteWidth: 64,
                spriteHeight: 64,
                scale: props.size,
                fps: 1
            }),
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: props.velocityX,
                velocityY: props.velocityY,
            }),
            new CParticle({
                type: type,
                size: props.size,
                deathSize: props.deathSize,
                decreaseRate: props.decreaseRate,
                color: null
            }),
            new CCircleCollider({
                radius: props.size
            }),
            new CDamage(props.damage),
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

const healthBarSegment = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'healthBarSegment',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: ASSET_MANAGER.cache[HEALTH_BAR_SEGMENT_SPRITE],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 1,
                fps: 1
            })
        ]
    })
}

const healthBarFill = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'healthBarFill',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: ASSET_MANAGER.cache[HEALTH_BAR_FILL_SPRITE],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 1,
                fps: 1
            })
        ]
    })
}

const armorBarSegment = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'healthBarSegment',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: ASSET_MANAGER.cache[ARMOR_BAR_SEGMENT_SPRITE],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 1,
                fps: 1
            })
        ]
    })
}

const weaponSlot = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'healthBarSegment',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_SLOT_SPRITE],
                spriteWidth: 32,
                spriteHeight: 32,
                scale: 2,
                fps: 1
            })
        ]
    })
}

const zombieEnemyEntity = (entitymanager, props) => {
    let midPoint = {
        x: ((32 * 1.4) * .5) + props.x,
        y: ((32 * 1.4) * .5) + props.y
    }
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
                x: props.x,
                y: props.y,
                maxVelocity: 50
            }),
            new CCircleCollider({
                x: midPoint.x,
                y: midPoint.y,
                radius: 16
            }),
            new CHealth(10),
            new CFieldOfSight({
                x: midPoint.x,
                y: midPoint.y,
                radius: 700
            })
        ]
    })
}

const mainMenuButtonEntity = (entitymanager, props) => {
    return entitymanager.addEntity({
        tag: 'UIButton',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: ASSET_MANAGER.cache[MAIN_MENU_BUTTON_SPRITE],
                spriteWidth: 200,
                spriteHeight: 48,
                scale: 1,
                fps: 1
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: 200,
                height: 48
            }),
            new CState({
                static: {
                    frameX: 0,
                    frameY: 0,
                },
                pressed: {
                    frameX: 0,
                    frameY: 1,
                    timeLimit: 2
                },
                initial: 'static'
            }),
            new CTextBox({
                x: props.x + 20,
                y: props.y + 28.8,
                width: 200,
                height: 48,
                fontSize: '16px',
                fillStyle: 'white',
                fillStyleActive: 'red',
                maxChars: 10,
                textAlign: 'left ',
                text: 'HelloWorld'
            })
        ]
    })
}

const playerScore = (entityManager, props) => {
    return entityManager.addEntity({
        tag: 'playerScore',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CTextBox({
                x: props.x,
                y: props.y,
                width: 200,
                height: 48,
                fontSize: '16px',
                fillStyle: 'white',
                fillStyleActive: 'red',
                maxChars: 10,
                textAlign: 'left ',
                text: '0'
            }), 
        ]
    })
}