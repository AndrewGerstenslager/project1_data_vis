class Histogram {
    constructor(_config, _data, _dropDownName) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 300,
        margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 10},
      }
      this.data = _data;
      this.dropDownName = _dropDownName;

      
      this.initVis();
    }
  
    initVis() {
        let vis = this;

        // Get the parent element
        let parentElement = d3.select(vis.config.parentElement);

        // Get the width and height of the parent element
        vis.config.containerWidth = parentElement.node().clientWidth || 200;
        vis.config.containerHeight = parentElement.node().clientHeight || 400;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = parentElement.append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.g = vis.svg.append("g")
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        // Get the initial selected option from the dropdown
        var selectedOption = d3.select(this.dropDownName).property("value");

        d3.select(this.dropDownName).on("change", function() {
            var selectedOption = d3.select(this).property("value");
            vis.updateVis(selectedOption);
        });

        vis.updateVis(selectedOption);
    }
  
    updateVis() {
        let vis = this;
        const selectedOption = d3.select(this.dropDownName).property("value");

        // Adjust the height of the SVG and the yScale to make room for the x-axis labels
        let adjustedHeight = vis.height - 40;
        let adjustedWidth = vis.width - 40;

        // Remove the existing x-axis and label
        vis.g.selectAll(".x-axis").remove();
        vis.g.selectAll(".y-axis").remove();
        vis.g.selectAll(".x-label").remove();


        let selectedData = vis.data[1].map(d => +d[selectedOption]);
    
        // Define the scale for the histogram
        let xScale = d3.scaleLinear()
            .domain(d3.extent(selectedData)) // Use d3.extent to get the min and max of the data
            .range([60, adjustedWidth]);
    
        // Generate a histogram using twenty uniformly-spaced bins.
        let histogram = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(20));
    
        let bins = histogram(selectedData);
        
        // Define the scale for the y-axis
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([vis.height, 0]);

        // Update the yScale domain
        yScale.domain([0, d3.max(bins, d => d.length)]).range([adjustedHeight, 0]);

        // Define the x-axis
        let xAxis = d3.axisBottom(xScale);

        // Append the x-axis to the SVG
        vis.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + adjustedHeight + ")")
            .call(xAxis)
            .selectAll("text")  
            .style("font-size", "14px");

            
        // Define the y-axis
        let yAxis = d3.axisLeft(yScale);

        // Append the y-axis to the SVG
        vis.g.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(60,0)") // Add 30 to the x-coordinate
            .style("font-size", "14px")
            .call(yAxis);
        
         // Append a label for the x-axis
        vis.g.append("text")        
            .attr("class", "x-label")     
            .attr("transform", "translate(" + (vis.width/2) + " ," + (vis.height) + ")")
            .style("text-anchor", "middle")
            .text(selectedOption)
            .style("font-size", "16px");
                
        // Append a label for the y-axis
        vis.g.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.config.margin.left)
            .attr("x",0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Frequency")
            .style("font-size", "16px");
    
        
            
        // Draw the histogram
        vis.g.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", 1)
            .attr("transform", d => `translate(${xScale(d.x0)},${yScale(d.length)})`)
            .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr("height", d => adjustedHeight - yScale(d.length))
            .attr("fill", "steelblue") // Set the color of the bars to "steelblue"
            .on('mouseover', function(event, d) { // Show the tooltip on mouseover
                d3.select(this).transition().duration(300).style('opacity', 1);
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html("<strong>Frequency:</strong> " + "<span>" + d.length + "</span>");
            })
            .on('mousemove', function(event) { // Move the tooltip with the mouse
                d3.select('#tooltip')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', function(d) { // Hide the tooltip on mouseout
                d3.select(this).transition().duration(300).style('opacity', 1);
                d3.select('#tooltip').style('opacity', 0);
            });

    }
  }