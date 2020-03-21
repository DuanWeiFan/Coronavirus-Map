
function render(data) {
    var svg = d3.select("svg"),
        margin = {left: 50, right: 10, top: 10, bottom: 30},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

    var g = d3.select("svg")
              .append("g")
              .attr("width", width)
              .attr("height", height)
              .attr("transform", `translate(${margin.left},${margin.top})`);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var c10 = d3.scaleOrdinal(d3.schemeCategory10);

    var xValue = function(d) {return d["Age"]},
        xScale = d3.scaleLinear()
                   .range([0, width])
                   .domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1])
                   .nice(),
        xAxis = g.append("g")
                  .attr("class", "x axis")
                  .attr("transform", `translate(0, ${height})`)
                  .call(d3.axisBottom(xScale))
                  .append("text")
                    .attr("x", width)
                    .attr("y", -5)
                    .style("text-anchor", "end")
                    .text("Age");

    var yValue = function(d) {return d["Height"]},
        yScale = d3.scaleLinear()
                   .range([height, 0])
                   .domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1])
                   .nice(),
        yAxis = g.append("g")
                  .attr("class", "y axis")
                  .attr("transform", `translate(0, 0)`)
                  .call(d3.axisLeft(yScale))
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Height");

    g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function(d) {return xScale(d["Age"]);})
        .attr("cy", function(d) {return yScale(d["Height"]);})
        .attr("fill", function(d) {return c10(d["Name"])})
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["Name"] + "<br/> (" + d["Age"] 
                + ", " + d["Height"] + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    // draw legend
    var legend = svg.selectAll(".legend")
        .data(c10.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { 
            return "translate("+0+"," + (height/2 + i*20) + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", c10);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });
}

d3.json("/get-data", data => {
    render(data)
});
