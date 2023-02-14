const getReadings = async () => {
	return await fetch("https://pec.smarthub.coop/gwt/secured/ReadingsService", {});
};

const energyUpdate = async () => {
	const readings = await getReadings();

	console.log({
		hello: "world",
		readings
	});
};

const energyRunner = () => {
	energyUpdate();
	setInterval(energyUpdate, HOUR_MS * 24);
};

energyRunner();
