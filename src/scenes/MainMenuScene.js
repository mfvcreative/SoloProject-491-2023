

class MainMenuScene extends Scene {
    constructor() {
        super()

    }

    init() {
        mapEntities(this.entityManager, mainMenuMapping, mainMenuButtonEntity)
        this.uiSystem = new UISystem(this.entityManager.getEntities)
    }

    update(click, mouseDown, mouse, wheel, keys, tick) {
        this.entityManager.update()
        this.uiSystem.update(click, mouse, tick)
    }

    draw(ctx) {
        this.renderSystem.draw(ctx)
    }
}