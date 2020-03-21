var defaultColor = "#dddddd7b";
// var color = d3.scalePow()
//     .range([defaultColor, 'red']);
var color = d3.scaleSequential(d3.interpolateOrRd).domain([0,6]);

const level = accumulate => {
    if (accumulate == 0)
        return 0;
    else if (accumulate <= 10)
        return 1;
    else if (accumulate <= 100)
        return 2;
    else if (accumulate <= 500)
        return 3;
    else if (accumulate <= 1000)
        return 4;
    else if (accumulate <= 5000)
        return 5;
    else
        return 6;
};

const mergeInfo = (coronavirus, usState, state_name_mapping) => {
    for (var i = 0; i < coronavirus.length; i++) {
        // var dataState = state_name_mapping[coronavirus[i]["state"]];
        var newCase = coronavirus[i]["new"],
            accumulate = coronavirus[i]["accumulate"],
            death = coronavirus[i]["death"],
            cured = coronavirus[i]["cured"];

        // Find the corresponding state inside the GeoJSON
        
        for (var j = 0; j < usState.features.length; j++) {
            var state = usState.features[j].properties.name;

            if (coronavirus[i]['state'] == state) {

                // Copy the data value into the JSON
                usState.features[j].properties.newCase = newCase;
                usState.features[j].properties.accumulate = accumulate;
                usState.features[j].properties.death = death;
                usState.features[j].properties.cured = cured;
                usState.features[j].properties.level = level(accumulate);

                // Stop looking through the JSON
                break;
            }
        }
    }
    return usState
};

const renderMap = (g, coronavirus, usState, selectedState, state_name_mapping, mapOnClick) => {
    // color.domain([0, 300]);
    
    usState = mergeInfo(coronavirus, usState, state_name_mapping);
    
    // Bind the data to the SVG and create one path per GeoJSON feature
    var paths = g.selectAll('path').data(usState.features);
    
    paths.enter().append("path")
        .attr("d", path)
        .on('click', mapOnClick)
        .merge(paths)
        .style("stroke", d => {
            if (d.properties.name == selectedState) {
                return '#fffead';
            }
            return 'rgb(135, 130, 130)';
        }).style("stroke-width", d => {
            if (d.properties.name == selectedState) {
                return "3";
            }
            return "1";
        })
        .style("fill", d => color(d.properties.level))
        .append('title')
            .text(d => {
                return `New Cases: ${d.properties.newCase},\n`+
                `Accumulate Cases: ${d.properties.accumulate},\n`+
                `Death: ${d.properties.death},\n`+
                `Cured: ${d.properties.cured}`
            });
    renderMapLabel(g, usState, state_name_mapping);
}

const renderMapLabel = (g, usState, state_name_mapping) => {
    var reverse_mapping = {};
    for (var obj in state_name_mapping) {
        reverse_mapping[state_name_mapping[obj]] = obj;
    }
    // add state names
    g.append("g")
     .attr("class", "states-names")
     .selectAll("text")
        .data(usState.features.filter(d => d.properties.name != "Puerto Rico"))
     .enter().append("svg:text")
        .text(d => reverse_mapping[d.properties.name])
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor","middle")
        .attr('font-size', '9px')
        .attr('fill', 'white');
}