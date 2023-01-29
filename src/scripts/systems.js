// Variety of ways to check for a collection
class CollisionSystem {
    constructor(entities) {
        this.entities = entities
        this.directions = {
            UP: [-130,-45],
            DOWN: [45,130],
            UP_LEFT: [-179,-135],
            DOWN_LEFT: [135, 180],
            RIGHT: [-30,30]
        }
    }
    update(deltaTime) {
        this.entities.forEach(e => {
            if(e.isDrawable) {
                if(e.components.circleCollider) {
                    this.entities.forEach(t => {
                        if(t.isDrawable) {
                            if(e.id !== t.id) {
                                //check for border box collisions
                                if(t.components.boxCollider) {
                                    let circ = e.components.circleCollider
                                    //console.log(e)
                                    if(this.#circleRectangleCollision(circ, t.components.boxCollider)) {
                                        if(e.tag === 'player' || e.tag === 'enemy') {
                                            circ.collisions[t.tag] = {pos: t.components.boxCollider, dir: this.#checkDirection(e, t)}
                                            this.#playerCollisionResolution(e, deltaTime)  
                                        } else {
                                            circ.collisions[t.tag] = true
                                        }
                                        
                                    }
                                } else if(t.components.circleCollider) {
                                    if(e.tag !== 'player') {
                                        let circA = e.components.circleCollider
                                        let circB = t.components.circleCollider
                                        if(this.#circleCollisions(circA, circB)) {
                                            circA.collisions[t.tag] = true
                                        }
                                    }
                                    if(e.tag === 'enemy' && t.tag === 'player') {
                                        let circA = e.components.fieldOfSight
                                        let circB = t.components.circleCollider
                                        if(this.#circleCollisions(circA, circB)) {
                                            circA.sighted[t.tag] = t
                                        }
                                    }
                                    if(e.tag === 'projectile') this.#projectileCollisionResolution(e, t)
                                }
                            }
                        }
                    })
                    
                   // if(e.tag === 'enemy') this.#enemyCollisionResolution(e)
                }
            }

        })
    }

    #playerCollisionResolution(player) {
        let collisions = player.components.circleCollider.collisions
        for(let e in collisions) {
            if(e === 'collisionBox') {
               let dir = collisions[e].dir
               let t = player.components.transform
               dir.x *= t.maxVelocity
               dir.y *= t.maxVelocity
               player.components.transform.velocityX += dir.x
               player.components.transform.velocityY += dir.y
            }
            collisions[e].dir = {
                x: 0,
                y: 0
            }
        }
    }

    #projectileCollisionResolution(projectile, enemy) {
        let collisions = projectile.components.circleCollider.collisions

        for(let c in collisions) {
            if(c === 'collisionBox') {
                projectile.destroy()
            } else if(c === 'enemy' && enemy.tag === 'enemy') {
                enemy.components.health.currentHealth -= projectile.components.damage.damage
                projectile.destroy()
            }
        }
    }

    #enemyCollisionResolution(enemy) {

    }

    //Collision between two Rectangles, does not return direction of collision
    boxCollision(entityA, entityB, deltaTime) {

        let a = entityA.components.boxCollider
        let b = entityB.components.boxCollider
        let futurePos = {
            x: a.x + (entityA.components.transform.velocityX * deltaTime),
            y: a.y + (entityA.components.transform.velocityY * deltaTime)
        }
        if(futurePos.x < b.x + b.width &&
            futurePos.x + a.width > b.x &&
            futurePos.y < b.y + b.height &&
            futurePos.y + a.height > b.y) {
            return true
        }
    }
    #circleCollisions(circA, circB) {
        let dx = circA.x - circB.x
        let dy = circA.y - circB.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        return dist < (circA.radius + circB.radius)
    }

    #circleRectangleCollision(circ, rect) {
        let expandedRect = {
            x: rect.x - circ.radius,
            y: rect.y - circ.radius,
            width: rect.width + (circ.radius * 2),
            height: rect.height + (circ.radius * 2)
        }
        if(this.pointInRect({x: circ.x, y: circ.y}, expandedRect)) {
            //return this.#checkCorners(circ, rect)
            return true
        }
        return false
    }

    #checkCorners(circ, rect) {
        if(this.#circleCollisions(circ, {x: rect.x, y: rect.y, radius: 0})) return true
        if(this.#circleCollisions(circ, {x: rect.x + rect.width, y: rect.y, radius: 0})) return true
        if(this.#circleCollisions(circ, {x: rect.x, y: rect.y + rect.height, radius: 0})) return true
        if(this.#circleCollisions(circ, {x: rect.x + rect.width, y: rect.y + rect.height, radius: 0})) return true
        return false
    }
    /**
     * Checks which side the collision occurs.
     * entityA is the player.
     * @param {Entity} entityA 
     * @param {Entity} entityB 
     * @return {Array} of directions
     */
    #checkDirection(entityA, entityB) {
        let a = entityA.components.circleCollider
        let b = entityB.components.boxCollider
        let midPointB = {
            x: b.x + (b.width * .5),
            y: b.y + (b.height * .5)
        }
        return normalize(midPointB, a)
    }

    // Checks if point is within a rectangle
    pointInRect = (point, rect) => {
        return (point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height)
    }
}


// Draws entities that have sprites
class RenderSystem {
    constructor(entities) {
        this.entities = entities
    }

    draw(ctx) {
        this.entities.forEach(e => {
            if(e.isDrawable) {
                if(e.tag === 'player') {
                    this.#handlePlayer(ctx, e)
                }
                else if(e.components.transform && e.components.sprite) {
                    let sprite = e.components.sprite
                    ctx.drawImage(
                        sprite.sprite,
                        sprite.frameX,
                        sprite.frameY,
                        sprite.spriteWidth,
                        sprite.spriteHeight,
                        e.components.transform.x,
                        e.components.transform.y,
                        sprite.scaledWidth,
                        sprite.scaledHeight
                    )
                }
            }
        })

    }

    #handlePlayer(ctx, e) {
        let t = e.components.transform
        let sprite = e.components.sprite
        let offset = 10 // so origin can be on players head
        ctx.save()
        ctx.translate(t.x, t.y)
        ctx.rotate(t.angle)
        ctx.drawImage(
            sprite.sprite,
            sprite.frameX,
            sprite.frameY,
            sprite.spriteWidth,
            sprite.spriteHeight,
            -sprite.scaledWidth * .5,
            -sprite.scaledHeight * .5 - offset,
            sprite.scaledWidth,
            sprite.scaledHeight
        )
        ctx.restore()
    }
}



/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target) {
        this.sceneWIDTH = WIDTH * .5
        this.sceneHEIGHT = HEIGHT * .5
        this.worldWidth = WIDTH_PIXELS,
        this.worldHeight = HEIGHT_PIXELS,
        this.targetPos = target.components.transform
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT    
    }

    update() {
        if(this.targetPos.x - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if(this.targetPos.x + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - WIDTH
        }
        else {
            this.x = this.targetPos.x - this.sceneWIDTH
        }

        if(this.targetPos.y + this.sceneHEIGHT >= this.worldHeight + BLOCKSIZE) {
            this.y = this.worldHeight - HEIGHT + BLOCKSIZE
        }
        else {
            this.y = this.targetPos.y - this.sceneHEIGHT
        }
    }
}

class PlayerInputSystem {
    constructor(player) {
        this.player = player
        this.playerPos = this.player.components.transform
        this.circleCollider = this.player.components.circleCollider
        this.speed = 200
    }
    /**
     * Controlls
     * a - move left
     * d - move right
     * " " - jump
     * @param {input params} input
     */
    update(input, mouse, tick) {
      
        this.playerPos.angle = Math.atan2(mouse.x - this.playerPos.x, -(mouse.y - this.playerPos.y))

        if(input['a']) {
            this.playerPos.velocityX = clamp((this.playerPos.velocityX - this.speed), -this.playerPos.maxVelocity, 0) * tick
        } if(input['d']) {
            this.playerPos.velocityX = clamp((this.playerPos.velocityX + this.speed), 0, this.playerPos.maxVelocity) * tick
        } if(input['w']) {
            this.playerPos.velocityY = clamp((this.playerPos.velocityY - this.speed), -this.playerPos.maxVelocity, 0) * tick
        } if(input['s']) {
            this.playerPos.velocityY = clamp((this.playerPos.velocityY + this.speed), 0, this.playerPos.maxVelocity) * tick
        } if(!input['w'] && !input['s']){
            this.playerPos.velocityY = 0
        } if(!input['a'] && !input['d']) {
            this.playerPos.velocityX = 0
        }

        // move hitbox with player
        this.playerPos.x += this.playerPos.velocityX
        this.playerPos.y += this.playerPos.velocityY
        this.circleCollider.x = this.playerPos.x
        this.circleCollider.y = this.playerPos.y
    }
}

class EnemyStateSystem {
    constructor(entities) {
        this.entities = entities
    }
    update(tick) {
        this.entities.forEach(e => {
            if(e.tag === 'enemy') {
                if(e.components.health.currentHealth <= 0) {
                    e.destroy()

                } else if(e.components.fieldOfSight.sighted['player']) {
                    let player = e.components.fieldOfSight.sighted['player'].components.transform
                    let t = e.components.transform
                    let dir = normalize(t, player)
                    dir.x = dir.x * t.maxVelocity * tick
                    dir.y = dir.y * t.maxVelocity * tick
                    e.components.transform.x += dir.x
                    e.components.transform.y += dir.y
                    e.components.circleCollider.x = e.components.transform.x
                    e.components.circleCollider.y = e.components.transform.y
                    e.components.fieldOfSight.x = e.components.transform.x
                    e.components.fieldOfSight.y = e.components.transform.y
                    if(getDistance(t, player) > e.components.fieldOfSight.radius * 2) {
                        e.components.fieldOfSight.sighted = {}
                    }
                }
                
            }
        })
    }
}

class ProjectileSystem {
    constructor(entitiesManager) {
        this.entityManager = entitiesManager
        this.fired = false
    }

    update(tick) {
        this.entityManager.getEntities.forEach(e => {
            if(e.tag === 'projectile') {
                let t = e.components.transform
                let b = e.components.circleCollider
                t.x += t.velocityX * tick
                t.y += t.velocityY * tick
                b.x = t.x
                b.y = t.y
            }
        })
    }
    spawnBullet(mouse, player) {
        if(!this.fired) {
            let x = player.components.transform.x
            let y = player.components.transform.y
            let dirVector = normalize({x:x, y:y}, mouse)
            let bullet = bulletEntity(this.entityManager, {
                x: x + (dirVector.x * 30),
                y: y + (dirVector.y * 30)
            })
            
            dirVector.x = dirVector.x * bullet.components.transform.maxVelocity
            dirVector.y = dirVector.y * bullet.components.transform.maxVelocity
            bullet.components.transform.velocityX = dirVector.x
            bullet.components.transform.velocityY = dirVector.y
            this.fired = true
        }
        
    }
    ready() {
        this.fired = false
    }
}

class LifespanSystem {
    constructor(entities) {
        this.entities = entities
    }

    update(tick) {
        this.entities.forEach(e => {
            if(e.components.lifespan) {
                let span = e.components.lifespan
                if(span.current <= 0) {
                    e.destroy()
                } else {
                    span.current -= tick
                }
            }
        })
    }
}