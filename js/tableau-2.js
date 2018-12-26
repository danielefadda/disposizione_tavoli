var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Rc0OMUw45znURdQMVxlvkI7QJTJLZ1j9FTsltu7s8_A/edit?usp=sharing';

// d3.csv('data/tableau.csv')
function drawChart(data) {
	console.log('data dentro chart', data);
	d3.select('#tabellone').html('');
	var table = d3.select('#tabellone').append('div')
		.attr('class', 'container-fluid');
	var thead = table.append('div')
		.attr('class', 'thead');
	var tbody = table.append('div')
		.attr('class', 'tbody');
	// manipulate data
	var tavoliData = d3.nest()
		.key(d => d['nome tavolo'])
		.rollup(function (leaves) {
			return {
				'elenco': leaves.map(d => d.invitato),
				'numero commensali': leaves.length
			}
		})
		.entries(data);
	console.log('tavoliData', tavoliData);

	nomiTavoli = tavoliData.map(d => d.key);
	console.log('nomiTavoli', nomiTavoli);

	datiTabella = tavoliData.map(function (d, i) {
		return {
			'numero invitati': +d.value['numero commensali'],
			'N.': i + 1,
			'Tavolo': d.key.toUpperCase().trim(),
			'Commensali': d.value.elenco.map(el => el.trim()).join(' · ').toUpperCase(),
			'lunghezzaElenco': +d.value.elenco.toString().length
		}
	});
	console.log('dataTable', datiTabella);

	nomiTavoli = tavoliData.map(d => d.key);
	console.log('nomiTavoli', nomiTavoli);

	var columns = ['N.', 'Tavolo', 'Commensali']; //TODO:prenderli dai dati

	// append the header row
	thead.append('div')
		.attr('class', 'row')
		.selectAll('div')
		.data(columns)
		.enter()
		.append('div')
		.attr('class', 'col')
		.append('div')
		.attr('class', 'casella')
		.append('span')
		.attr('class', 'testo')
		.text(d => d.toUpperCase());
	// create a row for each object in the data
	var rows = tbody
		.selectAll('div')
		.data(datiTabella)
		.enter()
		.append('div')
		.attr('class', 'row');

	// create a cell in each row for each column
	var cells = rows.selectAll('div')
		.data(function (row) {
			return columns.map(function (column) {
				return {
					column: column,
					value: row[column]
				};
			});
		})
		.enter()
		.append('div')
		.attr('class', 'col')
		.append('div')
		.attr('class', 'casella')
		.append('span')
		.attr('class', 'testo')
		.text(function (d) {
			return d.value;
		});

	d3.selectAll('div#tabellone div.col:nth-child(1)')
		.classed('col-1', true)
		.classed('num-tavolo', true);

	d3.selectAll('div#tabellone div.col:nth-child(2)')
		.classed('col-3', true)
		.classed('nomi-tavolo', true);

	d3.selectAll('div#tabellone div.col:nth-child(3)')
		.classed('col-8', true)
		.classed('invitati', true);
	//animate the string
	d3.selectAll('div.casella:nth-child(1n)>span')
		.each(function (d, i) {
			if (getInnerWidth(d3.select(this).node()) > getInnerWidth(d3.select(this.parentNode.parentNode).node())) {
				//marquee(d3.select(this).node(), d3.select(this).node().innerText);
				var dupNode = d3.select(this).node().cloneNode(true);
				d3.select(this).node().parentNode.appendChild(dupNode);
				marquee(d3.select(this).node(), i, 100);
			} else {
				//non scorrere
			}
		});
	return table;
};


//Qui inizia lo script di tabletop
// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1DbgtNoqzgEZwz1gobswzhCVh_KcJ29XFuDN_0BHdNpA/pubhtml'; //inserire qui il link al file di Google Sheet

function renderSpreadsheetData() {
	Tabletop.init({
		key: public_spreadsheet_url,
		callback: draw,
		simpleSheet: true
	})
}

function draw(data, tabletop) {
	// draw chart
	drawChart(data);
}

renderSpreadsheetData();
//Qui finisce il codice di tabletop


getInnerWidth = function (elem) {
	var style = window.getComputedStyle(elem);
	return elem.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
};

/******************** */

function marquee(htmlEl, index, speed) {
	// speed in px/s
	// Time = Distance/Speed
	var spanLength = htmlEl.offsetWidth;
	var timeTaken = spanLength / speed;
	addCSSRule(document.styleSheets[2], '@keyframes marquee-' + index, '0% {left: 0;}100% {left: calc(' + -spanLength + 'px - 1rem)}');
	htmlEl.parentNode.style.animationName = 'marquee-' + index;
	htmlEl.parentNode.style.animationTimingFunction = 'linear';
	htmlEl.parentNode.style.animationIterationCount = 'infinite';
	htmlEl.parentNode.style.animationDuration = timeTaken + 's';
}

function visualizzaData() {
	let d = new Date();
	let ottieniParteData = function (opt) {
		return d.toLocaleDateString('it-IT', opt).toUpperCase();
	}
	$('#nome-giorno').text(ottieniParteData({
		weekday: 'short'
	}));
	$('#giorno').text(ottieniParteData({
		day: 'numeric'
	}));
	$('#mese').text(ottieniParteData({
		month: 'short'
	}));
	$('#ora').html(d.getHours().toString().padStart(2, '0') +
		(d.getSeconds() % 2 === 0 ? ':' : '<span style="visibility: hidden;">:</span>') +
		d.getMinutes().toString().padStart(2, '0'));
}
visualizzaData();
setInterval(visualizzaData, 1000);


function addCSSRule(sheet, selector, rules, index) {
	console.log(sheet);
	if ('insertRule' in sheet) {
		sheet.insertRule(selector + '{' + rules + '}', index);
	} else if ('addRule' in sheet) {
		sheet.addRule(selector, rules, index);
	}
}