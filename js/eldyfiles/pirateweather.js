const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const celciusToFahrenheit = (c) => {
	return c * (9 / 5) + 32;
};

const getTranslatedUnitsForCelciusValue = (c) => {
	return {
		c: roundToOneDecimal(c),
		f: roundToOneDecimal(celciusToFahrenheit(c))
	};
};

const recursivelyReadStream = async (stream) => {
	const output = await stream.read();
	if (output.done) {
		return output.value;
	}

	const nextValue = await recursivelyReadStream(stream);
	if (nextValue === undefined) {
		return output.value;
	}

	return new Uint8Array([...output.value, ...nextValue]);
};

const parseWeatherUpdateJsonAsForecastTable = (weatherUpdateJson) => {
	const l = weatherUpdateJson.daily.data.length;
	return weatherUpdateJson.daily.data
		.map((day, index) => {
			const highs = getTranslatedUnitsForCelciusValue(day.temperatureMax);
			const lows = getTranslatedUnitsForCelciusValue(day.temperatureMin);

			const displayDay = index === 0 ? "Today" : dayArray[new Date(day.time * 1000).getDay()];

			return `
            <tr ${l - index == 1 && 'style="opacity:0.25"'} ${l - index == 2 && 'style="opacity:0.50"'} ${l - index == 3 && 'style="opacity:0.75"'} >
                <td>${displayDay}</td>

                <td style="color:coral">${highs.f}°F</td>
                <td style="color:coral">/</td>
                <td style="color:coral">${highs.c}°C</td>

                <td style="color:#6495ED">${lows.f}°F</td>
                <td style="color:#6495ED">/</td>
                <td style="color:#6495ED">${lows.c}°C</td>
            </tr>
        `;
		})
		.join("");
};

const fetchPirateWeatherUpdate = async () => {
	// get weather forecast for austin
	const requestUrl = "https://merry-sky.onrender.com/weather?q=cedar%20park&source=pirateweather";
	const result = await fetch(requestUrl);
	const readBody = await recursivelyReadStream(result.body.getReader());

	const readBodyString = new TextDecoder("utf-8").decode(readBody);
	const readBodyStringJson = JSON.parse(readBodyString);

	return readBodyStringJson;
};

const getCurrentWeatherFromHourlyArray = (weatherUpdateJson) => {
	const currentTimestampSeconds = Math.ceil(Date.now() / 1000); //+ 0 * 60 * 60;
	const hourlySorted = [...weatherUpdateJson.hourly.data].sort((a, b) => {
		return a.time - b.time;
	});

	const currentDatapoint = hourlySorted.find((d) => d.time > currentTimestampSeconds);

	return currentDatapoint;
};

const weatherUpdate = async () => {
	const weatherUpdateJson = await fetchPirateWeatherUpdate();

	console.log({ weatherUpdateJson });

	const nowWeatherDatapoint = getCurrentWeatherFromHourlyArray(weatherUpdateJson);

	const currentActualTempurature = nowWeatherDatapoint.temperature;
	const currentFeelsLikeTempurature = nowWeatherDatapoint.apparentTemperature;

	const current = {
		actual: getTranslatedUnitsForCelciusValue(currentActualTempurature),
		feelsLike: getTranslatedUnitsForCelciusValue(currentFeelsLikeTempurature)
	};
	document.getElementById("weatherLocation").textContent = `Weather | ${weatherUpdateJson.merry.location.name}`;
	document.getElementById("weatherActualTemp").textContent = `${current.actual.f}°F / ${current.actual.c}°C /// ${nowWeatherDatapoint.summary}`;
	document.getElementById("weatherFeelsLikeTemp").textContent = `Feels like ${current.feelsLike.f}°F / ${current.feelsLike.c}°C`;

	document.getElementById("weatherExtraInfo").textContent = `
		${roundToOneDecimal(weatherUpdateJson.currently.humidity * 100)}% Humidity /// ${roundToOneDecimal(weatherUpdateJson.currently.cloudCover * 100)}% Cloud cover`;

	document.getElementById("weatherForecastTable").innerHTML = parseWeatherUpdateJsonAsForecastTable(weatherUpdateJson);
};

const weatherUpdateWithErrorHandling = async (retries = 5) => {
	if (retries <= 0) return;

	try {
		await weatherUpdate();
		document.getElementById("weatherErrorMessage").innerHTML = "";
	} catch (e) {
		document.getElementById("weatherErrorMessage").innerHTML = `${e} /// retries left: ${retries - 1}`;
		setTimeout(() => weatherUpdateWithErrorHandling(retries - 1), 10 * 1000);
	}
};

const weatherRunner = () => {
	weatherUpdateWithErrorHandling();
	setInterval(() => weatherUpdateWithErrorHandling(), HOUR_MS * 3);
};

weatherRunner();
