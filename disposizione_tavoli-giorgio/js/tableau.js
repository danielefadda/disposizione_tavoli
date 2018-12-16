console.log('ready');
d3.csv('data/tableau.csv')
    .then(function (data) {
        console.log('rows', data);


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

        datiTabella = tavoliData.map(function (d) {
            return {
                'numero invitati': +d.value['numero commensali'],
                'Tavolo': d.key,
                'Commensali': d.value.elenco.join(', ').toUpperCase(),
                'lunghezzaElenco': +d.value.elenco.toString().length
            }
        });
        console.log('dataTable', datiTabella);

        nomiTavoli = tavoliData.map(d => d.key);
        console.log('nomiTavoli', nomiTavoli);

        var columns = ['Tavolo', 'Commensali']; //TODO:prenderli dai dati

        // append the header row
        thead.append('div')
            .attr('class', 'row')
            .selectAll('div')
            .data(columns)
            .enter()
            .append('div')
            .attr('class', 'col')
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
            .append('span')
            .attr('class', 'testo')
            .text(function (d) {
                return d.value;
            });

        d3.selectAll('div.col:nth-child(1)')
            .classed('col-3', true)
            .classed('nomi-tavolo', true);

        d3.selectAll('div.col:nth-child(2)')
            .classed('col-9', true)
            .classed('invitati', true);
        //animate the string
        d3.selectAll('div.tbody div.col:nth-child(1n)>span')
            .each(function (d, i) {
                if (getInnerWidth(d3.select(this).node()) > getInnerWidth(d3.select(this.parentNode).node())) {
                    marquee(d3.select(this).node(), d3.select(this).node().innerText);
                }
            });
        return table;
    });

getInnerWidth = function (elem) {
    var style = window.getComputedStyle(elem);
    return elem.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
};


function marquee(htmlEl, text) {
    text += '          ';
    setInterval(function () {
        let num = 1;
        let result = text.substr(num) + text.substr(0, num);
        htmlEl.innerText = result;
        text = result;
    }, 250);
}