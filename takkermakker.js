
var weeks = [
	"BBxDxxB",
	"DxDxxBx",
	"BDxBxxx",
	"DxBxBxx",
	"BBxDxxD",
	"DxDxxDx",
	"BDxBxxx",
	"DxBxDxx",
];

var cols = [
	"VACUUM",
	"WASHUP",
	"DUSTING",
	"DISINFECTION",
	"FRIDGE",
	"STOVE",
	"BALCONY",
];

var startingDate = moment("2018-10-01");
moment.locale('hu');

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


var daniChores = [];
var balintChores = [];
var today = "";
var currentTime;
var weekStart;
var weekEnd;


function updateWeek(time) {
	currentTime = time;
	weekStart = moment(time).startOf("isoWeek").format("MM.DD.");
	weekEnd = moment(time).endOf("isoWeek").format("MM.DD.");
	var weeksPassed = time.diff(startingDate, "weeks");
	var idx = (weeksPassed % 8 + 8) % 8;
	var row = weeks[idx];
	var dani = [];
	var balint = [];
	for (var i = 0; i < row.length; i++) {
		switch (row.charAt(i)) {
			case "D":
				dani.push(cols[i]);
				break;
			case "B":
				balint.push(cols[i]);
				break;
		}
	}

	daniChores = dani;
	balintChores = balint;
	today = time.format("YYYY. MM. DD");

	render();
}

function moveWeek(num) {
	updateWeek(moment(currentTime).add(num, "week"));
}

function moveToNow() {
	updateWeek(moment().utc());
}

function render() {
	var container = $(".todo-container");
	container.children().remove();
	renderTodo(container, "Bálint", balintChores);
	renderTodo(container, "Dani", daniChores);

	$("#date").text(`${today} 💩(${weekStart}-${weekEnd})`);
}

function renderTodo(container, name, chores) {
	var nameEl = $(`<div class="name">${name}</div>`);
	container.append(nameEl);

	var listEl = $("<ul></ul>");
	nameEl.after(listEl);
	chores.forEach(ch => {
		var itemEl = $("<li></li>");
		listEl.append(itemEl);
		itemEl.append(`<span class="title">${getChoreTitle(ch)}:</span>`);
		itemEl.append(`<span class="description"> ${getChoreDescription(ch)}</span>`);
	})
}

$(() => {
	moveToNow();
});