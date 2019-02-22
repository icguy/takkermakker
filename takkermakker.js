
let weeks = [
	"BBxDxxB",
	"DxDxxBx",
	"BDxBxxx",
	"DxBxBxx",
	"BBxDxxD",
	"DxDxxDx",
	"BDxBxxx",
	"DxBxDxx",
];

let cols = [
	"VACUUM",
	"WASHUP",
	"DUSTING",
	"DISINFECTION",
	"FRIDGE",
	"STOVE",
	"BALCONY",
]

function getChoreTitle(chore) {
	switch (chore) {
		case "VACUUM": return "porszívózás";
		case "WASHUP": return "felmosás";
		case "DUSTING": return "törölgetés";
		case "DISINFECTION": return "fertőtlenítés";
		case "FRIDGE": return "hűtő takarítás";
		case "STOVE": return "sütő takarítás";
		case "BALCONY": return "erkély - csak szezonban";
	}
	return "";
}

function getChoreDescription(chore) {
	switch (chore) {
		case "VACUUM": return "mindenhol";
		case "WASHUP": return "3 vödör vízzel: nappali (+ parkettaápoló); előszoba és wc; konyha és fürdő";
		case "DUSTING": return "párkányok, polcok, szekrények, kilincsek és környékük, ajtók teteje, wctartály, radiátorok, asztalok, konyhapult, csövek, lámpabúrák, minden egyéb vízszintes felület";
		case "DISINFECTION": return "mosogató, kézmosó, kád, lefolyók, wc és mellette a fal";
		case "FRIDGE": return "kipakolás, kimosás, fertőtlenítés, kifolyó tisztítás, kiszedhető komponensek tisztítása, szükség esetén leolvasztás, mosogatógép, tükrök";
		case "STOVE": return "kívül belül zsírtalanítás, fertőtlenítés, a szét- és kiszedhető komponensek zsírtalanítása, fiók, a sütő körüli fal zsírtalanítása, mikró";
		case "BALCONY": return "söprés (a rács és az ajtó között is), felmosás, bútorok letörlése, rács letörlése, párkány letörlése";
	}
	return "";
}

let startingDate = moment("2018-10-01");

$(() => {
	window.app = new AppComponent();
});

class AppComponent {

	daniChores = [];
	balintChores = [];
	today = "";
	currentTime;
	weekStart;
	weekEnd;

	constructor() {
		moment.locale('hu');
		this.moveToNow();
	}

	updateWeek(time) {
		this.currentTime = time;
		this.weekStart = moment(time).startOf("isoWeek").format("MM.DD.");
		this.weekEnd = moment(time).endOf("isoWeek").format("MM.DD.");
		let weeksPassed = time.diff(startingDate, "weeks");
		let idx = (weeksPassed % 8 + 8) % 8;
		let row = weeks[idx];
		let dani = [];
		let balint = [];
		for (let i = 0; i < row.length; i++) {
			switch (row.charAt(i)) {
				case "D":
					dani.push(cols[i]);
					break;
				case "B":
					balint.push(cols[i]);
					break;
			}
		}

		this.daniChores = dani;
		this.balintChores = balint;
		this.today = time.format("YYYY. MM. DD");

		this.render();
	}

	moveWeek(num) {
		this.updateWeek(moment(this.currentTime).add(num, "week"));
	}

	moveToNow() {
		this.updateWeek(moment().utc());
	}

	render() {
		let container = $(".todo-container");
		container.children().remove();
		this.renderTodo(container, "Bálint", this.balintChores);
		this.renderTodo(container, "Dani", this.daniChores);

		$("#date").text(`${this.today} 💩(${this.weekStart}-${this.weekEnd})`);
	}
	
	renderTodo(container, name, chores) {
		let nameEl = $(`<div class="name">${name}</div>`);
		container.append(nameEl);

		let listEl = $("<ul></ul>");
		nameEl.after(listEl);
		chores.forEach(ch => {
			let itemEl = $("<li></li>");
			listEl.append(itemEl);
			itemEl.append(`<span class="title">${getChoreTitle(ch)}:</span>`);
			itemEl.append(`<span class="description"> ${getChoreDescription(ch)}</span>`);
		})
	}
}