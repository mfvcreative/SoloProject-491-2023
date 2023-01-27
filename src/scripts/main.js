

const options = {
    debugging: true
}

const gameEngine = new GameEngine(options);

const ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache);
	gameEngine.start();
});
