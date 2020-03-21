
const svg = d3.select('svg');

const width = +svg.attr('width'),
      height = +svg.attr('height');

const projection = d3.geoMercator(),
      pathGenerator = d3.geoPath().projection(projection);

svg.append('path')
   .attr('class', 'sphere')
   .attr('d', pathGenerator({type: 'Sphere'}))

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", d => {
    const countries = topojson.feature(d, d.objects.countries);
    console.log(countries);
    svg.selectAll('path')
      .data(countries.features)
      .enter().append('path')
        .attr('d', pathGenerator)
        .attr('class', 'countries')
      .append('title')
          .text(d => d.id);
});
