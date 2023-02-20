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
                                        if(e.tag === 'player') {
                                            circ.collisions[t.tag] = {pos: t.components.boxCollider, dir: this.#checkDirection(e, t)}
                                            this.#playerCollisionResolution(e)  
                                        } else if(e.tag === 'enemy') {
                                            circ.collisions[t.tag] = {pos: t.components.boxCollider, dir: this.#checkDirection(e, t)}
                                            this.#enemyCollisionResolution(e)
                                        } else {
                                            circ.collisions[t.tag] = true
                                        }
                                        
                                    }
                                } else if(t.components.circleCollider) {
                                    if(e.tag === 'player' && t.tag === 'enemy') {
                                        let circA = e.components.circleCollider
                                        let circB = t.components.circleCollider
                                        if(this.#circleCollisions(circA, circB)) {
                                            circA.collisions[t.tag] = true
                                        }
                                    }
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
                                    if(e.tag === 'player') this.#playerCollisionResolution(e, deltaTime)
                                }
                            }
                        }
                    })
                }
            }

        })
    }

    #playerCollisionResolution(player, deltaTime) {
        let collisions = player.components.circleCollider.collisions
        for(let e in collisions) {
            if(e === 'collisionBox') {
               let dir = collisions[e].dir
               let t = player.components.transform
               dir.x *= t.maxVelocity
               dir.y *= t.maxVelocity
               player.components.transform.velocityX += dir.x
               player.components.transform.velocityY += dir.y
               player.components.circleCollider.collisions = {}
            } else if(e === 'enemy') {
                let h = player.components.health
                if(!h.invulnerability) {
                    player.components.health.currentHealth -= DAMAGE_VALUE
                    h.invulnerability = true
                } else {
                    h.invulnerabilityTimer += deltaTime
                    if(h.invulnerabilityTimer >= INVULNERABILITY_TIME) {
                        h.invulnerability = false
                        h.invulnerabilityTimer = 0
                    }
                }
                player.components.circleCollider.collisions = {}
            }
        }
    }

    #enemyCollisionResolution(enemy) {
        let collisions = enemy.components.circleCollider.collisions
        for(let e in collisions) {
            if(e === 'collisionBox') {
               let dir = collisions[e].dir
               let t = enemy.components.transform
               dir.x *= t.maxVelocity
               dir.y *= t.maxVelocity
               //console.log('x: ',enemy.components.transform.velocityX, 'Y: ', enemy.components.transform.velocityY)
               enemy.components.transform.velocityX += dir.x
               enemy.components.transform.velocityY += dir.y
               //console.log('After x: ',enemy.components.transform.velocityX, 'Y: ', enemy.components.transform.velocityY)
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
        if(CollisionSystem.pointInRect({x: circ.x, y: circ.y}, expandedRect)) {
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
    static pointInRect = (point, rect) => {
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
                    this.#handlePlayer(ctx, e, 10)
                } else if(e.tag === 'enemy') {
                    this.#handlePlayer(ctx, e, -3)
                } else if(e.tag === 'particle') {
                    this.#handleParticle(ctx, e)
                } else if(e.components.transform && e.components.sprite) {

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
                if(e.components.textBox) {
                    this.#drawText(ctx, e)
                }
            }
        })

    }

    #handlePlayer(ctx, e, offset) {
        let t = e.components.transform
        let sprite = e.components.sprite
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

    #handleParticle(ctx, e) {
        let p = e.components.particle
        if(p.type === 'dust') {
            ctx.beginPath()
            ctx.arc(e.components.transform.x, e.components.transform.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.fill()
        } else if(p.type === 'fire') {
            let t = e.components.transform
            let sprite = e.components.sprite
            ctx.drawImage(
                sprite.sprite,
                sprite.frameX,
                sprite.frameY,
                sprite.spriteWidth,
                sprite.spriteHeight,
                e.components.transform.x,
                e.components.transform.y,
                (sprite.spriteWidth * p.size),
                (sprite.spriteHeight * p.size)
            )
        }

    }

    #drawText(ctx, e) {
        let t = e.components.textBox
        ctx.textAlign = t.textAlign
        ctx.font = `${t.fontSize} PressStart2P-Regular`
        ctx.fillStyle = t.fill
        ctx.fillText(`${t.text}`, t.x, t.y)
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
    update(input, mouseDown, mouse, tick) {

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
    constructor(entities, player) {
        this.entities = entities
        this.player = player
    }
    update(tick) {
        this.entities.forEach(e => {
            if(e.tag === 'enemy') {
                if(e.components.health.currentHealth <= 0) {
                    this.player.components.score.score += 50
                    e.destroy()

                } else if(e.components.fieldOfSight.sighted['player']) {
                    let player = e.components.fieldOfSight.sighted['player'].components.transform
                    let t = e.components.transform
                    let dir = normalize(t, player)
                    e.components.transform.angle = Math.atan2(player.x - t.x, -(player.y - t.y))
                    dir.x = dir.x * t.maxVelocity * tick
                    dir.y = dir.y * t.maxVelocity * tick
                    e.components.transform.x += dir.x
                    e.components.transform.y += dir.y
                    e.components.circleCollider.x = t.x
                    e.components.circleCollider.y = t.y
                    e.components.fieldOfSight.x = t.x
                    e.components.fieldOfSight.y = t.y

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
        this.coolDown = 0
        this.offset = 30
        this.dustColor = rgba(0,0,0,.2)
        this.dustDeathSize = .5
        this.dustDecreaseRate = .95
    }

    update(tick, mouseDown, mouse, player) {
        this.coolDown -= tick
        this.entityManager.getEntities.forEach(e => {
            if(e.tag === 'projectile') {
                let t = e.components.transform
                let b = e.components.circleCollider
                t.x += t.velocityX * tick
                t.y += t.velocityY * tick
                b.x = t.x
                b.y = t.y
                this.#createBulletTrail(e)
            } else if(e.tag === 'particle' || e.tag === 'statusEffect') {
                if(e.components.particle.type === 'dust') {
                    let s = e.components.particle.size *= e.components.particle.decreaseRate
                    if(s <= e.components.particle.deathSize) {
                        e.destroy()
                    } else {
                        let t = e.components.transform
                        t.x += t.velocityX
                        t.y += t.velocityY
                    }
                    
                } else if(e.components.particle.type === 'fire') {
                    let s = e.components.particle.size += .1
                    if(s > e.components.particle.deathSize) {
                        e.destroy()
                    }
                    let t = e.components.transform
                    t.x += t.velocityX * tick
                    t.y += t.velocityY * tick
                }
            }
        })
        if(mouseDown && this.coolDown <= 0) {
            this.#fire(mouse, player)
        }
    }
    #fire(mouse, player) {
        switch(player.components.weapons.currentWeapon.name) {
            case 'flamethrower': this.#fireFlameThrower(mouse, player)
                break
            case 'shotgun': this.#fireShotGun(mouse, player)
                break
            default: this.#firePistolOrRifle(mouse, player)
                break
        }
    }
    #firePistolOrRifle(mouse, player) {
            let x = player.components.transform.x
            let y = player.components.transform.y
            let weapon = player.components.weapons.currentWeapon
            let dirVector = normalize({x:x, y:y}, mouse)
            let bullet = bulletEntity(this.entityManager, {
                x: x + (dirVector.x * this.offset),
                y: y + (dirVector.y * this.offset),
                size: weapon.projectileSize,
                damage: weapon.damage
            })
            dirVector.x = dirVector.x * weapon.projectileVelocity
            dirVector.y = dirVector.y * weapon.projectileVelocity
            bullet.components.transform.velocityX = dirVector.x
            bullet.components.transform.velocityY = dirVector.y
            this.#createBulletTrail(bullet)
            this.coolDown = weapon.coolDown
    }

    #fireShotGun(mouse, player) {
        let x = player.components.transform.x
        let y = player.components.transform.y
        let weapon = player.components.weapons.currentWeapon
        let directionVector = normalize({x:x, y:y}, mouse)

        for(let i = 0; i < 5; i++) {
            let dirVector = {
                x: directionVector.x,
                y: directionVector.y
            }
            let bullet = bulletEntity(this.entityManager, {
                x: x + (dirVector.x * this.offset),
                y: y + (dirVector.y * this.offset),
                size: weapon.projectileSize,
                damage: weapon.damage
            })
            let angle = -.2 + (.1 * i)
            dirVector.x = (dirVector.x * Math.cos((angle))) - dirVector.y * Math.sin(angle)
            dirVector.y = (dirVector.y * Math.cos((angle))) + dirVector.x * Math.sin(angle)
            dirVector.x = dirVector.x * weapon.projectileVelocity
            dirVector.y = dirVector.y * weapon.projectileVelocity
            bullet.components.transform.velocityX = dirVector.x
            bullet.components.transform.velocityY = dirVector.y
            this.#createBulletTrail(bullet)
        }
        
        this.coolDown = weapon.coolDown
    }

    #fireFlameThrower(mouse, player) {
            let x = player.components.transform.x
            let y = player.components.transform.y
            
            let weapon = player.components.weapons.currentWeapon
            let dirVector = normalize({x:x, y:y}, mouse)
            let fire = fireParticleEntity(this.entityManager, {
                x: x + (dirVector.x * this.offset),
                y: y + (dirVector.y * this.offset),
                size: weapon.projectileSize,
                damage: weapon.damage,
                deathSize: weapon.projectileSize * 4,
                decreaseRate: this.dustDecreaseRate
            })
            dirVector.x = dirVector.x * weapon.projectileVelocity
            dirVector.y = dirVector.y * weapon.projectileVelocity
            fire.components.transform.velocityX = dirVector.x
            fire.components.transform.velocityY = dirVector.y
            this.coolDown = weapon.coolDown
            console.log('fire: ', fire.components.transform.x, fire.components.transform.y)
            console.log('player: ',x,y)
    }

    #createBulletTrail(e) {
        dustParticleEntity(this.entityManager, {
            x: e.components.transform.x,
            y: e.components.transform.y,
            velocityX: e.components.transform.velocityX,
            velocityY: e.components.transform.velocityY,
            size: 5,
            color: this.dustColor,
            deathSize: this.dustDeathSize,
            decreaseRate: this.dustDecreaseRate
        })
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


class UISystem {
    constructor(entities, player) {
        this.entities = entities
        this.player = player
    }

    update(click, mouseOver, tick) {
        this.entities.forEach(e => {
            if(e.tag === 'UIButton') {
                let s = e.components.state
                if(s.currentState === 'static') {
                    if(click && CollisionSystem.pointInRect(click, e.components.boxCollider)) {
                        this.#setState(e, 'pressed')
                    }
                } else if(s.currentState === 'pressed') {
                    let res = e.components.state.states['pressed'].timeLimit -= tick
                    if(res < 0) {
                        this.#setState(e, 'static')
                    }
                }
                if(CollisionSystem.pointInRect(mouseOver, e.components.boxCollider)) {
                    e.components.textBox.fill = e.components.textBox.fillStyleActive
                } else {
                    e.components.textBox.fill = e.components.textBox.fillStyle
                }
                
            } else if(e.tag === 'playerScore') {
                e.components.textBox.text = `$ ${this.player.components.score.score}`
            }
        })
        this.#drawHealthArmorBar() 
    }

    init(entityManager) {
        this.healthFill = []
        for(let i = 0; i < this.player.components.health.currentHealth * BLOCK_SIZE; i += BLOCK_SIZE) {
            let props = {
                x: BLOCK_SIZE + i,
                y: BLOCK_SIZE
            }
            healthBarSegment(entityManager, props)
           this.healthFill.push(healthBarFill(entityManager, props))
        }
        this.armor = []
        let y = BLOCK_SIZE * 2
        for(let i = 0; i < MAX_ARMOR_VALUE * BLOCK_SIZE; i += BLOCK_SIZE) {
            let props = {
                x: BLOCK_SIZE + i,
                y: y
            }
           this.armor.push(armorBarSegment(entityManager, props))
        }

    }

    #drawHealthArmorBar() {
        let health = this.player.components.health
        let armor = this.player.components.armor.currentArmor
        for(let i = health.currentHealth; i < health.maxHealth; i++) {
            this.healthFill[i].isDrawable = false
        }
        for(let i = armor; i < MAX_ARMOR_VALUE; i++) {
            this.armor[i].isDrawable = false
        }

    }

    #setState(e, state) {
       e.components.state.currentState = state
       let s = e.components.state.states[state]
       e.components.sprite.frameX = s.frameX
       e.components.sprite.frameY = s.frameY
       e.components.sprite.maxFrames = s.maxFrames || 1
    }
}

class SpawnSystem {
    constructor(entityManager) {
        this.entityManager = entityManager
        this.timer = 0
        this.spawnLocations = [
            {x: -BLOCK_SIZE, y: HEIGHT * .5},
            {x: WIDTH + BLOCK_SIZE, y: HEIGHT * .5},
            {x: WIDTH * .5, y: -BLOCK_SIZE},
            {x: WIDTH * .5, y: HEIGHT + BLOCK_SIZE}
        ]
    }
    spawn() {
        let location = randomInt(this.spawnLocations.length)
        let pos = this.spawnLocations[location]
        zombieEnemyEntity(this.entityManager, pos)
    }
}
