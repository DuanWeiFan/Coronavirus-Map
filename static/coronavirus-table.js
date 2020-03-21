
const renderTable = (coronavirus, tableOnClick, state_name_mapping) => {
    const table = d3.select('#table').append('table'),
          titles = Object.keys(coronavirus[0]),
          thead = table.append('thead'),
          tbody = table.append('tbody');
    // console.log(state_name_mapping);
    // for (var i = 0; i < coronavirus.length; i++) {
    //   console.log('state:' + coronavirus[i]['state']);
    //   console.log('state mapping:' + state_name_mapping[coronavirus[i]['state']]);
    //   coronavirus[i]['state'] = state_name_mapping[coronavirus[i]['state']];
    // }
    thead.append('tr')
           .selectAll('th')
           .data(titles).enter()
         .append('th')
             .text( d => d);
    const rows = tbody.selectAll('tr')
                      .data(coronavirus)
                      .enter().append('tr')
                      .on('click', tableOnClick);
    const cells = rows.selectAll('td')
                      .data(row =>
                        titles.map(title => {
                            return {'title': title, 'value': row[title]}
                        })
                       ).enter()
                      .append('td')
                        .attr("style", "font-family: Courier") // sets the font style
                        .text(function(d) { return d.value; });
}
