// scatter.js
class Scatter {
    constructor(config, data, dropdown1Id, dropdown2Id) {
        this.config = config;
        // Assuming data is the second element from the Promise.all result
        this.data = data[1]; // Adjust according to actual data structure
        this.dropdown1Id = dropdown1Id;
        this.dropdown2Id = dropdown2Id;
        this.margin = { top: 10, right: 30, bottom: 30, left: 40 }; // Define margins

        this.width = 460 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        // Adjust selector to match your HTML structure
        this.svg = d3.select("." + this.config.parentElement)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // Shift the axes
        this.xAxis = this.svg.append("g").attr("transform", "translate(0," + (this.height - this.margin.bottom + 50) + ")");
        this.yAxis = this.svg.append("g").attr("transform", "translate(" + (this.margin.left + 50) + ",0)");

        // Add x and y labels
        this.xLabel = this.svg.append("text")
            .attr("transform", "translate(" + (this.width / 2) + " ," + (this.height + 20) + ")")
            .style("text-anchor", "middle");

        this.yLabel = this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle");
            
        this.initVis();
    }

    initVis() {
        let vis = this;

        // Define scales
        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);
    
        // Append SVG group for the axes
        vis.xAxis = vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${vis.height - 20})`);
    
        vis.yAxis = vis.svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(0,${-20})`);
    
        // Initialize the scatter plot
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Retrieve selected options
        const selectedOption1 = d3.select(vis.dropdown1Id).property("value");
        const selectedOption2 = d3.select(vis.dropdown2Id).property("value");

        
        // Update scales
        vis.xScale.domain(d3.extent(vis.data, d => +d[selectedOption2]));
        vis.yScale.domain(d3.extent(vis.data, d => +d[selectedOption1]));

        // Update axes
        vis.xAxis.transition().duration(1000).call(d3.axisBottom(vis.xScale));
        vis.yAxis.transition().duration(1000).call(d3.axisLeft(vis.yScale));
        // Update x and y labels
        vis.xLabel.text(selectedOption2);
        vis.yLabel.text(selectedOption1);
        // Bind data to circles, creating/updating/removing elements as needed
        const dots = vis.svg.selectAll(".dot")
            .data(vis.data, d => d.id); // Assuming each data point has a unique 'id'

        dots.enter().append("circle")
            .attr("class", "dot")
            .merge(dots)
            .on('mouseover', function(event, d) {
                d3.select(this).transition().duration(300).style('opacity', 1);
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html("<strong>County:</strong> " + "<span>" + d['display_name'] + "</span>" + "<br/><strong>" +
                        selectedOption2 + ":</strong> " + "<span>" + d[selectedOption2] + "</span>" + "<br/><strong>" +
                        selectedOption1 + ":</strong> " + "<span>" + d[selectedOption1] + "</span>");
            })
            .on('mousemove', function(event) {
                d3.select('#tooltip')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).transition().duration(300).style('opacity', 1);
                d3.select('#tooltip').style('opacity', 0);
            })
            .transition().duration(1000)
            .attr("cx", d => vis.xScale(+d[selectedOption2]))
            .attr("cy", d => vis.yScale(+d[selectedOption1])-20)
            .attr("r", 5)
            .style("fill", "steelblue");
            
        dots.exit().remove();
    }
}
