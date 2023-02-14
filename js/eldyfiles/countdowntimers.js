const COUNTDOWNLIST = [
	{ name: "Lindsay Birth", date: "May 28 1997" },
	{ name: "Hogwarts Legacy Release", date: "Febuary 10 2023" },
	{ name: "Valentines Day", date: "Febuary 14 2023" },
	{ name: "Paramore Concert", date: "July 9 2023" },
	{
		name: "Super Mario World Opening",
		date: "February 17 2023"
	},
	{
		name: "Atomic Heart Release",
		date: "February 21 2023"
	},
	{
		name: "KSP 2 Release",
		date: "February 24 2023"
	},
	{
		name: "Maddie Birthday",
		date: "May 28 2023"
	},
	{
		name: "Eldy Birthday",
		date: "June 8 2023"
	},
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

	return timeUntils
		.sort((a, b) => a.millisecondsUntil - b.millisecondsUntil)
		.map((item) => {
			const name = item.name;
			const time = Math.ceil(item.millisecondsUntil / MILLISECONDS_PER_DAY);
			const dateHasPassed = time < 0;
			const dayIsToday = time === 0;

			let timeString = "";
			if (dayIsToday) timeString = "Today!!!";
			else if (dateHasPassed) timeString = `${time * -1} days ago`;
			else timeString = `${time} days`;

			return `
                <div ${dateHasPassed && 'style="color:#90EE90"'} ${dayIsToday && 'style="color:#6495ED"'} >
                    <span>${name} >>> </span>
                    <span>${timeString}</span>
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
