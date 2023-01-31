




const CSprite = function CSprite(props) {
    this.sprite = props.sprite
    this.spriteWidth = props.spriteWidth
    this.spriteHeight = props.spriteHeight
    this.scale = props.scale
    this.scaledWidth = this.spriteWidth * this.scale
    this.scaledHeight = this.spriteHeight * this.scale
    this.frameX = props.frameX || 0
    this.frameY = props.frameY || 0
    this.maxFrames = props.maxFrames || 0
    this.fps = 1 / props.fps
    this.timer = 0
    return this
}
CSprite.prototype.name = 'sprite'






const CTransform = function CTransform(props) {
    this.x = (props.x || 0)
    this.y = (props.y || 0)
    this.velocityX = 0
    this.velocityY = 0
    this.maxVelocity = props.maxVelocity || 500
    this.angle = 0
    return this
}
CTransform.prototype.name = 'transform'



const CState = function CState(props) {
    this.currentState = props.initial,
    this.states = props || {}
    return this
}
CState.prototype.name = 'state'



const CBoxCollider = function CBoxCollider(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    return this
}
CBoxCollider.prototype.name = 'boxCollider'

const CCircleCollider = function CCircleCollider(props) {
    this.x = props.x || 0
    this.y = props.y || 0
    this.radius = props.radius || 1
    this.collisions = {}
    return this
}
CCircleCollider.prototype.name = 'circleCollider'

const CLifespan = function CLifespan(total) {
    this.total = total
    this.current = this.total
    return this
}
CLifespan.prototype.name = 'lifespan'

const CDamage = function CDamage(total) {
    this.damage = total
    return this
}
CDamage.prototype.name = 'damage'

const CHealth = function CHealth(total) {
    this.currentHealth = total
    this.maxHealth = total
    return this
}
CHealth.prototype.name = 'health'

const CFieldOfSight = function CFieldOfSight(props) {
    this.x = props.x
    this.y = props.y
    this.radius = props.radius
    this.sighted = {}
    return this
}
CFieldOfSight.prototype.name = 'fieldOfSight'

const CTextBox = function CTextBox(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width,
    this.height = props.height,
    this.fontSize = props.fontSize
    this.maxChars = props.maxChars
    this.textAlign = props.textAlign
    this.fillStyle = props.fillStyle
    this.fillStyleActive = props.fillStyleActive
    this.fill = this.fillStyle
    this.text = props.text || ''
    return this
}
CTextBox.prototype.name = 'textBox'

const CWeapons = function CWeapons(props) {
    this.weaponList = props || [PISTOL_WEAPON]
    this.currentWeapon = SHOTGUN_WEAPON
}
CWeapons.prototype.name = 'weapons'