

const options = {
    debugging: true
}

const gameEngine = new GameEngine(options);

const ASSET_MANAGER = new AssetManager();
DEMO_ASSETS.forEach(e => {
	ASSET_MANAGER.queueDownload(e)
})

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	canvas.width = WIDTH
	canvas.height = HEIGHT
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});
