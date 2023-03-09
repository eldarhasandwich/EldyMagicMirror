const COUNTDOWNLIST = [
	{ name: "Paramore Concert", date: "July 9 2023" },
	{ name: "Lucy Cone Removal", date: "March 16 2023" },
	{
		name: "Maddie Birthday",
		date: "May 28 2023"
	},
	{
		name: "Eldy Birthday",
		date: "June 8 2023"
	},
	{
		name: "Fly out to Kentucky",
		date: "June 21 2023"
	},
	{ name: "Startfield Launch", date: "September 6 2023" },
	{
		name: "Halloween",
		date: "October 31 2023"
	},
	{
		name: "Christmas",
		date: "December 25 2023"
	},
	{
		name: "New Years",
		date: "January 1 2024"
	},
	{
		name: "Valentines Day",
		date: "Febuary 14 2024"
	},
	{
		name: "Maddie Birthday",
		date: "May 28 2024"
	},
	{
		name: "Eldy Birthday",
		date: "June 8 2024"
	}
];

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const parseCountdownsAsDivList = () => {
	const timeUntils = COUNTDOWNLIST.map((item) => {
		const n = Date.now();
		const t = new Date(item.date)[Symbol.toPrimitive]("number");
		return {
			...item,
			millisecondsUntil: t - n
		};
	});

	const l = timeUntils.length;

	return timeUntils
		.sort((a, b) => a.millisecondsUntil - b.millisecondsUntil)
		.map((item, index) => {
			const name = item.name;
			const time = Math.ceil(item.millisecondsUntil / MILLISECONDS_PER_DAY);
			const dateHasPassed = time < 0;
			const dayIsToday = time === 0;

			let timeString = "";
			if (dayIsToday) timeString = "Today!!!";
			else if (dateHasPassed) timeString = `${time * -1} days ago`;
			else timeString = `${time} days`;

			return `
				<div ${l - index == 1 && 'style="opacity:0.25"'} ${l - index == 2 && 'style="opacity:0.50"'} ${l - index == 3 && 'style="opacity:0.75"'} >
					<div ${dateHasPassed && 'style="color:#90EE90"'} ${dayIsToday && 'style="color:#6495ED"'} >
						<span>${name} >>> </span>
						<span>${timeString}</span>
					</div>
				</div>
            `;
		})
		.join("");
};

const countdownUpdate = () => {
	document.getElementById("countDownTimers").innerHTML = parseCountdownsAsDivList();
};

const countdownRunner = () => {
	countdownUpdate();
	setInterval(countdownUpdate, HOUR_MS);
};

countdownRunner();
