/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const geoData = data[0];
  const countyPopulationData = data[1];

  // Get the column names from the CSV data
  const columns = countyPopulationData.columns;
  // Combine both datasets by adding the population density to the TopoJSON file
  geoData.objects.counties.geometries.forEach(d => {
    // Find the matching county in the CSV data
    const matchingCounty = countyPopulationData.find(county => d.id === county.cnty_fips);

    // If a matching county was found, add each column from the CSV data to the JSON data
    if (matchingCounty) {
      columns.forEach(column => {
        // Skip the 'cnty_fips' column since it's already in the JSON data
        if (column !== 'cnty_fips') {
          d.properties[column] = matchingCounty[column];
          //console.log(column)
          //console.log(matchingCounty[column])
        }
      });
      //console.log(d.properties)
    }
  });

  const choroplethMap = new ChoroplethMap({ 
    parentElement: '.viz',   
  }, geoData, "#dropdown1");

  const choroplethMap2 = new ChoroplethMap({ 
    parentElement: '.viz2',   
  }, geoData, "#dropdown2");

  var propertyNames = columns.filter(d => d !== 'cnty_fips' && d !== 'display_name');

  // Add options to dropdown1
  var dropdown1 = d3.select("#dropdown1");
  dropdown1.selectAll('option')
    .data(propertyNames)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  
  // Add options to dropdown1
  var dropdown2 = d3.select("#dropdown2");
  dropdown2.selectAll('option')
    .data(propertyNames)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  let histogram1 = new Histogram({parentElement: '.graph1'}, data, '#dropdown1');
  let histogram2 = new Histogram({parentElement: '.graph2'}, data, '#dropdown2');
  let scatter = new Scatter({parentElement: 'scatter1'}, data,'#dropdown1','#dropdown2');


  // Add event listeners to the dropdowns
  d3.select('#dropdown1').on("change", () => {
    scatter.updateVis();
    choroplethMap.updateVis();
    histogram1.updateVis();
    });
  d3.select('#dropdown2').on("change", () => {
    scatter.updateVis();
    choroplethMap2.updateVis();
    histogram2.updateVis();
    });
    
})
.catch(error => console.error(error));
