class ChoroplethMap {

  /**
   * Class constructor with basic configuration
   * @param {Object} _config
   * @param {Array} _data
   * @param {String} _dropDownName
   */
  constructor(_config, _data,_dropDownName) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 10},
      tooltipPadding: 10,
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12,
      legendRectWidth: 150,
      currentProperty: _config.initialProperty || 'poverty_perc' // Default property to visualize
    }
    this.data = _data;
    this.dropDownName = _dropDownName
    this.us = _data;

    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', vis.config.containerWidth)
            .attr('width', vis.config.containerHeight)
            .on('click', vis.clicked);

    vis.colorScale = d3.scaleLinear()
            .domain([0, 11]) // This will be dynamically updated based on selected property
            .range(['#cfe2f2', '#0d306b'])
            .interpolate(d3.interpolateHcl);

    vis.projection = d3.geoAlbersUsa()
            .translate([vis.width / 2, vis.height / 2])
            .scale(vis.width);

    
    vis.path = d3.geoPath()
            .projection(vis.projection);

    vis.g = vis.svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom);

    vis.updateVis('poverty_perc');
  }

  updateVis(optionalInput = 'default') {
    let vis = this;
    // Dropdown selection logic
    var selectedOption;
    if (optionalInput !== 'default'){ selectedOption = optionalInput; }
    else{ selectedOption = d3.select(vis.dropDownName).property("value"); }

    // Update color scale domain based on current property
    vis.colorScale.domain(d3.extent(vis.data.objects.counties.geometries, d => +d.properties[selectedOption]));
    
    vis.counties = vis.g.selectAll(".county")
      .data(topojson.feature(vis.us, vis.us.objects.counties).features)
      .join("path")
      .attr("class", "county")
      .attr("d", vis.path)
      .attr('fill', d => {
        const value = d.properties[selectedOption];
        return value ? vis.colorScale(value) : 'url(#lightstripe)';
      })
      // Tooltip event listeners
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(300).style('opacity', 1);
        d3.select('#tooltip')
          .style('opacity', 1)
          .html(`
            <p><strong>County:</strong> ${d.properties['display_name']}</p>
            <p><strong>${selectedOption}:</strong> ${d.properties[selectedOption]}</p>
          `);
      })
      .on('mousemove', function(event) {
        d3.select('#tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(300).style('opacity', 1);
        d3.select('#tooltip').style('opacity', 0);
      });
  }
  
}