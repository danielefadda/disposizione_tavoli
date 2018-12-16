console.log('ready');
d3.csv('data/tableau.csv')
    .then(function (data) {
        console.log('rows',data);


        var table = d3.select('#tableau').append('table');
        var thead = table.append('thead');
        var tbody = table.append('tbody');

        // manipulate data
        var tavoliData = d3.nest()
            .key(d => d['nome tavolo'])
            .rollup(function(leaves) {
                    return {
                        'elenco':leaves.map(d => d.invitato),
                        'numero commensali':leaves.length,
                    }
            })
            .entries(data);
        console.log('tavoliData',tavoliData);

        nomiTavoli = tavoliData.map(d=>d.key);
        console.log('nomiTavoli',nomiTavoli);

        datiTabella= tavoliData.map(function (d){
                return {
                    // 'numero invitati': +d.value['numero commensali'],
                    'tavolo':d.key,
                    'invitati':d.value.elenco,
                    'lunghezzaElenco':+d.value.elenco.toString().length
                }
        });
        console.log('dataTable',datiTabella);

        nomiTavoli = tavoliData.map(d=>d.key);
        console.log('nomiTavoli',nomiTavoli);

        var columns = ['tavolo','invitati']; //TODO:prenderli dai dati

        // append the header row
        thead.append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .text(d => d)
        ;
        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
            .data(datiTabella)
            .enter()
            .append('tr')
        ;

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append('td')
            .append('div')
            // .attr('width', function (d,i) {
            //     return d.value.map(d => d.length ).reduce((a, b) => a + b, 0)*13;
            // })
            .text(function (d) { return d.value; })
        ;

        // d3.selectAll('td:nth-child(1)')
        //     .classed('numeroTavolo',true)
        // ;

        d3.selectAll('td:nth-child(1)')
            .classed('nomeTavolo',true)
        ;
        lunghezza_elenco=datiTabella.map(d => d.lunghezzaElenco*17);

        d3.selectAll('td:nth-child(2)')
            .attr('class' , 'elenco')
            .classed('marquee', function (d,i) {
                return lunghezza_elenco[i] > 450;
            })
            .selectAll('div')
            .attr('class' , 'testo')
            .attr('width', function (d,i) {
                return d.value.map(d => d.length ).reduce((a, b) => a + b, 0)*13;
            })

        ;



            // https://www.jonathan-petitcolas.com/2013/05/06/simulate-marquee-tag-in-css-and-javascript.html
        ;

        console.log('lunghezza_elenco',lunghezza_elenco);
        return table;
    });


