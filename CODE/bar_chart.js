const margin = {
	top: 75,
	right: 15,
	left: 100,
	bottom: 75
};
const fullWidth = 549; //850
const fullHeight = 550; //800 //1000
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

// definitions for ontology legend
var definitions = ['<b>Cellular Component:</b> The parts of a cell or its extracellular environment.', '<b>Molecular Function:</b> The elemental activities of a gene product at the molecular level, such as binding or catalysis.',
'<b>Biological Process:</b> Operations or sets of molecular events with a defined beginning and end, pertinent to the functioning of integrated living units: cells, tissues, organs, and organisms.'];

// format to round data importance
var format = d3.format(".3f");
// threshold to filter data 
var thresholdNumber = 10;
// tip tool
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([35, 274])
  .html(function(d) {
    return d.Ontology ;
  })

var svg = d3.select("body")
.select("#graph")
.append("svg")
.attr("id","bar_chart")
.attr("width", fullWidth)
.attr("height", fullHeight)
.append("g")
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.call(tip);

d3.dsv(
	",",
	"Gene_Importance_With_Expression.csv",
	function (row) {
		row.Lung = +format(row.Lung);		// Here Lung is plotted, change it accordingly everywhere 
		row.Lung_Expression = +format(row.Lung_Expression);
		return row;
	}
).then((data) => {			
	
	// order data 		
	data = data.sort((a, b) => d3.ascending(format(a.Lung), format(b.Lung)));

	// filter data to keep only top (thresholdNumber) important genes for each cancer type
	data = data.filter(function(d, i) { 
		return data.length - i <= thresholdNumber ; });

	// max importance
	maxCount = d3.max(data, function (d) { return Number(d.Lung); });

	// x and y scales and axis
	var xScaleBarChart = d3.scaleLinear()
	.domain([0, maxCount])
	.range([0, width]);

	var yScaleBarChart = d3.scaleBand()
		.range([height, 0])
		.domain(data.map(function (d) {
			return d.Name;
		}))
		.padding(0.05);

	var xAxis = d3.axisBottom(xScaleBarChart);
	var yAxis = d3.axisLeft(yScaleBarChart);

	svg.append("g")
		.classed('x_axis', true)
		.call(xAxis)
		.attr("transform", "translate(0," + height + ")")

	svg.append("g")
		.classed('y_axis', true)
		.call(yAxis);
	
	// add grid to the horizontal chart
	svg.append('g')
		.attr('class', 'grid')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom()
			.scale(xScaleBarChart)
			.tickSize(-height, 0, 0)
			.tickFormat(''))

	// add chart bars and mouse over and out events
	svg.append("g").selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("fill", "steelblue")
		.attr("x", xScaleBarChart(0))
		.attr("y", (d) => {
			return yScaleBarChart(d.Name);
		})
		.attr("width", (d) => {
			return xScaleBarChart(d.Lung);
		})
		.attr("height", yScaleBarChart.bandwidth())
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	//add bar chart title
	svg.append("text")
	.text("Top 10 Important Genes by Organ: " + "Lung")
	.attr("id", "barChartTitle")
	.attr('x', width / 2)
	.attr('y', 0 - margin.top / 4)
	.style("text-anchor", "middle");

	//x axis label
	svg.append("text")             
	  	.attr('x', width / 2)
		.attr('y', height + 35)
	  	.style("text-anchor", "middle")
	  	.text("Importance Metric")
	  	.attr("class", "axis_label");

	//y axis label
	svg.append("text")
     	.attr("transform", "rotate(-90)")
     	.attr("y", -margin.left + 10)
     	.attr("x",-height/2)
     	.attr("dy", "1em")
     	.style("text-anchor", "middle")
     	.text("Gene Name")  
     	.attr("class", "axis_label");  

	// add ontology legend
	var ul = d3.select("#legend")
				.append("ul")
				// .attr("id","legend");

	ul.selectAll('li')
		.data(definitions)
		.enter()
		.append('li')
		.attr("id","legend_text")
		.html(String);

	//Line Chart
	var svg3 = d3.select("body")
		.select("#graph2")
		.append("svg")
		.attr("id","line_chart")
		.attr("width", fullWidth)
		.attr("height", fullHeight)
		.append("g")
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	//max expression
	maxExp = d3.max(data, function (d) { return Number(d.Lung_Expression); });

	var yScaleLineChart = d3.scaleLinear()
		.domain([0, maxExp])
		.range([height, 0]);

	var xScaleLineChart = d3.scaleBand()
		.range([0, width])
		.domain(data.map(function (d) {
			return d.Name;
		}))
		//.padding(0.05);

	var xScaleLineChart2 = d3.scaleBand()
		.range([22, width + 22])
		.domain(data.map(function (d) {
			return d.Name;
		}))
		//.padding(0.05);

	var line = d3.line()
		.x(function(d) { return xScaleLineChart2(d.Name);})
		.y(function(d) { return yScaleLineChart(d.Lung_Expression)})
		.curve(d3.curveMonotoneX)

	svg3.append("path")
		.datum(data)
		.classed("line", true)
		.attr("d", line)

	var x_line_axis = d3.axisBottom(xScaleLineChart)
    var y_line_axis = d3.axisLeft(yScaleLineChart)

	svg3.append("g")
    	.call(x_line_axis)
    	.attr("transform", "translate(0," + (height + 2) + ")")
    	.classed("x_axis", true)
    	//.tickCenterLabel(false);
    	.selectAll("text")
    	.style("text-anchor", "end")
    	.attr("y", 0)
    	.attr("x", -9)
    	.attr("dy", ".35em")
    	.attr("transform", "rotate(-65)")
    	//.style("text-anchor", "start");

    svg3.append("text")
    	.attr("transform", "translate(" + width/2 + " ," + (height + 74) + ")")
    	.attr("text-anchor", "middle")
    	.text("Gene")
    	.attr("class", "axis_label");  

    svg3.append("g")
    	.call(y_line_axis)
    	.attr("transform", "translate("+ 0 +", 0)")
    	.classed("y_axis", true)

    svg3.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -margin.left*0.7)
    	.attr("x", -(height/2))
    	.attr("dy", "2em")
    	.attr("text-anchor", "middle")
    	.text("Gene Expression Level")
    	.attr("class", "axis_label");  

  	svg3.append("text")
    	.text("Gene Expression Levels of Important Genes")
    	.attr("x", width/2)
    	.attr("y", -20)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)    	
    	.attr("id","lineChartTitle")

	svg3.selectAll(".symbol")
	    	.data(data)
	  		.enter()
	  		.append("circle")
	    	.classed("symbol", true)
	    	.attr("cx", function(d) { 
	    		return xScaleLineChart2(d.Name) 
	    	})
	    	.attr("cy", function(d) { 
	    		return yScaleLineChart(d.Lung_Expression) 
	    	})
	    	.attr("r", function(d) {
	    		return 3
	    	})

});

//Body image
hema = null, lung = null, breast = null, kidney = null
d3.xml("svg_human_edit.svg", data => {
	d3.select("body").select("#body-container").node().append(data.documentElement)
    //d3.select("#body-container").node().append(data.documentElement)
    //svg2 = d3.select("#body-container > svg")
    svg2 = d3.select("body").select("#body-container > svg")
        .style("width", 300 + 'px')
        .style("height", 700 + 'px');
        // .style("width", 395 + 'px')
        // .style("height", 1086 + 'px');
    console.log(svg2)

    svg2.select(".hema").on("click", function () {
            hema.style.fill = "rgb(169,169, 169)"
            setTimeout(() => {
                hema.style.fill = hema.oriColor
            }, 100);
            
        }).on("mouseover", function (d) {
            if (!hema) {
                hema = this
                hema.oriColor = hema.style.fill

            }
            d3.select(this).style("fill", "rgb(255,127,80)")
            clickedOnHema()
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", hema.oriColor)
        });

    svg2.select(".kidney").on("click", function () {

		kidney.style("fill", "rgb(169,169, 169)")
		setTimeout(() => {
			kidney.style("fill", kidney.oriColor)
		}, 100);
            
        }).on("mouseover", function (d) {
            if (!kidney) {
				kidney = d3.select(this).select("#path2409")
                kidney.oriColor = kidney.style("fill")
            }
            d3.select(this).attr("opacity", "1")
            clickedOnKidney()
        })
        .on("mouseout", function (d) {
            d3.select(this).attr("opacity", 0.64)
        });

    svg2.select(".lung").on("click", function () {
            lung.style.fill = "rgb(169,169, 169)"
            setTimeout(() => {
                lung.style.fill = lung.oriColor
            }, 100);
            
        }).on("mouseover", function (d) {
            if (!lung) {
                lung = this
                lung.oriColor = lung.style.fill
                
            }
            d3.select(this).style("fill", "rgb(255,127,80)")
            clickedOnLung()
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", lung.oriColor)
        });

    svg2.select(".breast").on("click", function () {
            breast.style.fill = "rgb(169,169, 169)"
            setTimeout(() => {
                breast.style.fill = breast.oriColor
            }, 100);
            
        }).on("mouseover", function (d) {
            if (!breast) {
                breast = this
                breast.oriColor = breast.style.fill
                
            }
            d3.select(this).style("fill", "rgb(255,127,80)")
            clickedOnBreast();
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", breast.oriColor)
        });
});

function clickedOnKidney() {
	console.log("Kidney")
	d3.select('#bar_chart').remove()
	d3.select('#line_chart').remove()
	// d3.select('#legend').remove()

	var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("id","bar_chart")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.call(tip);

	d3.dsv(
		",",
		"Gene_Importance_With_Expression.csv",
		function (row) {
			row.Kidney = +format(row.Kidney);		// Here Kidney is plotted, change it accordingly everywhere 
			row.Kidney_Expression = +format(row.Kidney_Expression);
			return row;
		}
	).then((data) => {			
		
		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Kidney), format(b.Kidney)));

		// filter data to keep only top (thresholdNumber) important genes for each cancer type
		data = data.filter(function(d, i) { 
			return data.length - i <= thresholdNumber ; });

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Kidney); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			.padding(0.05);

		var xAxis = d3.axisBottom(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x_axis', true)
			.call(xAxis)
			.attr("transform", "translate(0," + height + ")")

		svg.append("g")
			.classed('y_axis', true)
			.call(yAxis);
		
		// add grid to the horizontal chart
		svg.append('g')
			.attr('class', 'grid')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom()
				.scale(xScaleBarChart)
				.tickSize(-height, 0, 0)
				.tickFormat(''))

		// add chart bars and mouse over and out events
		svg.append("g").selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", "steelblue")
			.attr("x", xScaleBarChart(0))
			.attr("y", (d) => {
				return yScaleBarChart(d.Name);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Kidney);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Top 10 Important Genes by Organ: " + "Kidney")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 4)
		.style("text-anchor", "middle");

		//x axis label
		svg.append("text")             
		  	.attr('x', width / 2)
			.attr('y', height + 35)
		  	.style("text-anchor", "middle")
		  	.text("Importance Metric")
		  	.attr("class", "axis_label");

		//y axis label
		svg.append("text")
	     	.attr("transform", "rotate(-90)")
	     	.attr("y", -margin.left + 10)
	     	.attr("x",-height/2)
	     	.attr("dy", "1em")
	     	.style("text-anchor", "middle")
	     	.text("Gene Name")    
	  		.attr("class", "axis_label");

		//Line Chart
		var svg3 = d3.select("body")
			.select("#graph2")
			.append("svg")
			.attr("id","line_chart")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
			.append("g")
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//max expression
		maxExp = d3.max(data, function (d) { return Number(d.Kidney_Expression); });

		var yScaleLineChart = d3.scaleLinear()
			.domain([0, maxExp])
			.range([height, 0]);

		var xScaleLineChart = d3.scaleBand()
			.range([0, width])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var xScaleLineChart2 = d3.scaleBand()
			.range([22, width + 22])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var line = d3.line()
			.x(function(d) { return xScaleLineChart2(d.Name);})
			.y(function(d) { return yScaleLineChart(d.Kidney_Expression)})
			.curve(d3.curveMonotoneX)

		svg3.append("path")
			.datum(data)
			.classed("line", true)
			.attr("d", line)

		var x_line_axis = d3.axisBottom(xScaleLineChart)
	    var y_line_axis = d3.axisLeft(yScaleLineChart)

		svg3.append("g")
	    	.call(x_line_axis)
	    	.attr("transform", "translate(0," + (height + 2) + ")")
	    	.classed("x_axis", true)
	    	//.tickCenterLabel(false);
	    	.selectAll("text")
	    	.style("text-anchor", "end")
	    	.attr("y", 0)
	    	.attr("x", -9)
	    	.attr("dy", ".35em")
	    	.attr("transform", "rotate(-65)")
	    	//.style("text-anchor", "start");

	    svg3.append("text")
	    	.attr("transform", "translate(" + width/2 + " ," + (height + 74) + ")")
	    	.attr("text-anchor", "middle")
	    	.text("Gene")
	    	.attr("class", "axis_label");  

	    svg3.append("g")
	    	.call(y_line_axis)
	    	.attr("transform", "translate("+ 0 +", 0)")
	    	.classed("y_axis", true)

	    svg3.append("text")
	    	.attr("transform", "rotate(-90)")
	    	.attr("y", -margin.left*0.7)
	    	.attr("x", -(height/2))
	    	.attr("dy", "2em")
	    	.attr("text-anchor", "middle")
	    	.text("Gene Expression Level")
	    	.attr("class", "axis_label");  

	  	svg3.append("text")
	    	.text("Gene Expression Levels of Important Genes")
	    	.attr("x", width/2)
	    	.attr("y", -20)
	    	.attr("text-anchor", "middle")
	    	.classed("plot_title",true)    	
	    	.attr("id","lineChartTitle")

		svg3.selectAll(".symbol")
		    	.data(data)
		  		.enter()
		  		.append("circle")
		    	.classed("symbol", true)
		    	.attr("cx", function(d) { 
		    		return xScaleLineChart2(d.Name) 
		    	})
		    	.attr("cy", function(d) { 
		    		return yScaleLineChart(d.Kidney_Expression) 
		    	})
		    	.attr("r", function(d) {
		    		return 3
		    	})
	});
}

function clickedOnHema() {
	console.log("Blood")
	d3.select('#bar_chart').remove()
	d3.select('#line_chart').remove()
	// d3.select('#legend').remove()

	var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("id","bar_chart")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.call(tip);

	d3.dsv(
		",",
		"Gene_Importance_With_Expression.csv",
		function (row) {
			row.Blood = +format(row.Blood);		// Here Blood is plotted, change it accordingly everywhere 
			row.Blood_Expression = +format(row.Blood_Expression);
			return row;
		}
	).then((data) => {			
		
		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Blood), format(b.Blood)));

		// filter data to keep only top (thresholdNumber) important genes for each cancer type
		data = data.filter(function(d, i) { 
			return data.length - i <= thresholdNumber ; });

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Blood); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			.padding(0.05);

		var xAxis = d3.axisBottom(xScaleBarChart)
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x_axis', true)
			.call(xAxis)
			.attr("transform", "translate(0," + height + ")")

		svg.append("g")
			.classed('y_axis', true)
			.call(yAxis);
		
		// add grid to the horizontal chart
		svg.append('g')
			.attr('class', 'grid')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom()
				.scale(xScaleBarChart)
				.tickSize(-height, 0, 0)
				.tickFormat(''))

		// add chart bars and mouse over and out events
		svg.append("g").selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", "steelblue")
			.attr("x", xScaleBarChart(0))
			.attr("y", (d) => {
				return yScaleBarChart(d.Name);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Blood);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Top 10 Important Genes by Organ: " + "Blood")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 4)
		.style("text-anchor", "middle");

		//x axis label
		svg.append("text")             
		  	.attr('x', width / 2)
			.attr('y', height + 35)
		  	.style("text-anchor", "middle")
		  	.text("Importance Metric")
		  	.attr("class", "axis_label");

		//y axis label
		svg.append("text")
	     	.attr("transform", "rotate(-90)")
	     	.attr("y", -margin.left + 10)
	     	.attr("x",-height/2)
	     	.attr("dy", "1em")
	     	.style("text-anchor", "middle")
	     	.text("Gene Name") 
	  		.attr("class", "axis_label");

			//Line Chart
		var svg3 = d3.select("body")
			.select("#graph2")
			.append("svg")
			.attr("id","line_chart")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
			.append("g")
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//max expression
		maxExp = d3.max(data, function (d) { return Number(d.Blood_Expression); });

		var yScaleLineChart = d3.scaleLinear()
			.domain([0, maxExp])
			.range([height, 0]);

		var xScaleLineChart = d3.scaleBand()
			.range([0, width])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var xScaleLineChart2 = d3.scaleBand()
			.range([22, width + 22])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var line = d3.line()
			.x(function(d) { return xScaleLineChart2(d.Name);})
			.y(function(d) { return yScaleLineChart(d.Blood_Expression)})
			.curve(d3.curveMonotoneX)

		svg3.append("path")
			.datum(data)
			.classed("line", true)
			.attr("d", line)

		var x_line_axis = d3.axisBottom(xScaleLineChart)
	    var y_line_axis = d3.axisLeft(yScaleLineChart)

		svg3.append("g")
	    	.call(x_line_axis)
	    	.attr("transform", "translate(0," + (height + 2) + ")")
	    	.classed("x_axis", true)
	    	//.tickCenterLabel(false);
	    	.selectAll("text")
	    	.style("text-anchor", "end")
	    	.attr("y", 0)
	    	.attr("x", -9)
	    	.attr("dy", ".35em")
	    	.attr("transform", "rotate(-65)")
	    	//.style("text-anchor", "start");

	    svg3.append("text")
	    	.attr("transform", "translate(" + width/2 + " ," + (height + 74) + ")")
	    	.attr("text-anchor", "middle")
	    	.text("Gene")
	    	.attr("class", "axis_label");  

	    svg3.append("g")
	    	.call(y_line_axis)
	    	.attr("transform", "translate("+ 0 +", 0)")
	    	.classed("y_axis", true)

	    svg3.append("text")
	    	.attr("transform", "rotate(-90)")
	    	.attr("y", -margin.left*0.7)
	    	.attr("x", -(height/2))
	    	.attr("dy", "2em")
	    	.attr("text-anchor", "middle")
	    	.text("Gene Expression Level")
	    	.attr("class", "axis_label");  

	  	svg3.append("text")
	    	.text("Gene Expression Levels of Important Genes")
	    	.attr("x", width/2)
	    	.attr("y", -20)
	    	.attr("text-anchor", "middle")
	    	.classed("plot_title",true)    	
	    	.attr("id","lineChartTitle")

		svg3.selectAll(".symbol")
		    	.data(data)
		  		.enter()
		  		.append("circle")
		    	.classed("symbol", true)
		    	.attr("cx", function(d) { 
		    		return xScaleLineChart2(d.Name) 
		    	})
		    	.attr("cy", function(d) { 
		    		return yScaleLineChart(d.Blood_Expression) 
		    	})
		    	.attr("r", function(d) {
		    		return 3
		    	})
	});
}

function clickedOnLung() {
	console.log("Lung")
	d3.select('#bar_chart').remove()
	d3.select('#line_chart').remove()
	// d3.select('#legend').remove()

	var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("id","bar_chart")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.call(tip);

	d3.dsv(
		",",
		"Gene_Importance_With_Expression.csv",
		function (row) {
			row.Lung = +format(row.Lung);		// Here Lung is plotted, change it accordingly everywhere 
			row.Lung_Expression = +format(row.Lung_Expression);
			return row;
		}
	).then((data) => {			
		
		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Lung), format(b.Lung)));

		// filter data to keep only top (thresholdNumber) important genes for each cancer type
		data = data.filter(function(d, i) { 
			return data.length - i <= thresholdNumber ; });

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Lung); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			.padding(0.05);

		var xAxis = d3.axisBottom(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x_axis', true)
			.call(xAxis)
			.attr("transform", "translate(0," + height + ")")

		svg.append("g")
			.classed('y_axis', true)
			.call(yAxis);
		
		// add grid to the horizontal chart
		svg.append('g')
			.attr('class', 'grid')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom()
				.scale(xScaleBarChart)
				.tickSize(-height, 0, 0)
				.tickFormat(''))

		// add chart bars and mouse over and out events
		svg.append("g").selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", "steelblue")
			.attr("x", xScaleBarChart(0))
			.attr("y", (d) => {
				return yScaleBarChart(d.Name);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Lung);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Top 10 Important Genes by Organ: " + "Lung")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 4)
		.style("text-anchor", "middle");

		//x axis label
		svg.append("text")             
		  	.attr('x', width / 2)
			.attr('y', height + 35)
		  	.style("text-anchor", "middle")
		  	.text("Importance Metric")
		  	.attr("class", "axis_label");

		//y axis label
		svg.append("text")
	     	.attr("transform", "rotate(-90)")
	     	.attr("y", -margin.left + 10)
	     	.attr("x",-height/2)
	     	.attr("dy", "1em")
	     	.style("text-anchor", "middle")
	     	.text("Gene Name")    
	  		.attr("class", "axis_label");

			//Line Chart
		var svg3 = d3.select("body")
			.select("#graph2")
			.append("svg")
			.attr("id","line_chart")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
			.append("g")
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//max expression
		maxExp = d3.max(data, function (d) { return Number(d.Lung_Expression); });

		var yScaleLineChart = d3.scaleLinear()
			.domain([0, maxExp])
			.range([height, 0]);

		var xScaleLineChart = d3.scaleBand()
			.range([0, width])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var xScaleLineChart2 = d3.scaleBand()
			.range([22, width + 22])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var line = d3.line()
			.x(function(d) { return xScaleLineChart2(d.Name);})
			.y(function(d) { return yScaleLineChart(d.Lung_Expression)})
			.curve(d3.curveMonotoneX)

		svg3.append("path")
			.datum(data)
			.classed("line", true)
			.attr("d", line)

		var x_line_axis = d3.axisBottom(xScaleLineChart)
	    var y_line_axis = d3.axisLeft(yScaleLineChart)

		svg3.append("g")
	    	.call(x_line_axis)
	    	.attr("transform", "translate(0," + (height + 2) + ")")
	    	.classed("x_axis", true)
	    	//.tickCenterLabel(false);
	    	.selectAll("text")
	    	.style("text-anchor", "end")
	    	.attr("y", 0)
	    	.attr("x", -9)
	    	.attr("dy", ".35em")
	    	.attr("transform", "rotate(-65)")
	    	//.style("text-anchor", "start");

	    svg3.append("text")
	    	.attr("transform", "translate(" + width/2 + " ," + (height + 74) + ")")
	    	.attr("text-anchor", "middle")
	    	.text("Gene")
	    	.attr("class", "axis_label");  

	    svg3.append("g")
	    	.call(y_line_axis)
	    	.attr("transform", "translate("+ 0 +", 0)")
	    	.classed("y_axis", true)

	    svg3.append("text")
	    	.attr("transform", "rotate(-90)")
	    	.attr("y", -margin.left*0.7)
	    	.attr("x", -(height/2))
	    	.attr("dy", "2em")
	    	.attr("text-anchor", "middle")
	    	.text("Gene Expression Level")
	    	.attr("class", "axis_label");  

	  	svg3.append("text")
	    	.text("Gene Expression Levels of Important Genes")
	    	.attr("x", width/2)
	    	.attr("y", -20)
	    	.attr("text-anchor", "middle")
	    	.classed("plot_title",true)    	
	    	.attr("id","lineChartTitle")

		svg3.selectAll(".symbol")
		    	.data(data)
		  		.enter()
		  		.append("circle")
		    	.classed("symbol", true)
		    	.attr("cx", function(d) { 
		    		return xScaleLineChart2(d.Name) 
		    	})
		    	.attr("cy", function(d) { 
		    		return yScaleLineChart(d.Lung_Expression) 
		    	})
		    	.attr("r", function(d) {
		    		return 3
		    	})
	});
}

function clickedOnBreast() {
	console.log("Breast")
	d3.select('#bar_chart').remove()
	d3.select('#line_chart').remove()
	// d3.select('#legend').remove()

	var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("id","bar_chart")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.call(tip);

	d3.dsv(
		",",
		"Gene_Importance_With_Expression.csv",
		function (row) {
			row.Breast = +format(row.Breast);		// Here Breast is plotted, change it accordingly everywhere 
			row.Breast_Expression = +format(row.Breast_Expression);
			return row;
		}
	).then((data) => {			
		
		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Breast), format(b.Breast)));

		// filter data to keep only top (thresholdNumber) important genes for each cancer type
		data = data.filter(function(d, i) { 
			return data.length - i <= thresholdNumber ; });

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Breast); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			.padding(0.05);

		var xAxis = d3.axisBottom(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x_axis', true)
			.call(xAxis)
			.attr("transform", "translate(0," + height + ")")

		svg.append("g")
			.classed('y_axis', true)
			.call(yAxis);
		
		// add grid to the horizontal chart
		svg.append('g')
			.attr('class', 'grid')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom()
				.scale(xScaleBarChart)
				.tickSize(-height, 0, 0)
				.tickFormat(''))

		// add chart bars and mouse over and out events
		svg.append("g").selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", "steelblue")
			.attr("x", xScaleBarChart(0))
			.attr("y", (d) => {
				return yScaleBarChart(d.Name);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Breast);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Top 10 Important Genes by Organ: " + "Breast")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 4)
		.style("text-anchor", "middle");

		//x axis label
		svg.append("text")             
		  	.attr('x', width / 2)
			.attr('y', height + 35)
		  	.style("text-anchor", "middle")
		  	.text("Importance Metric")
		  	.attr("class", "axis_label");

		//y axis label
		svg.append("text")
	     	.attr("transform", "rotate(-90)")
	     	.attr("y", -margin.left + 10)
	     	.attr("x",-height/2)
	     	.attr("dy", "1em")
	     	.style("text-anchor", "middle")
	     	.text("Gene Name")
	     	.attr("class", "axis_label");  

			//Line Chart
		var svg3 = d3.select("body")
			.select("#graph2")
			.append("svg")
			.attr("id","line_chart")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
			.append("g")
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//max expression
		maxExp = d3.max(data, function (d) { return Number(d.Breast_Expression); });

		var yScaleLineChart = d3.scaleLinear()
			.domain([0, maxExp])
			.range([height, 0]);

		var xScaleLineChart = d3.scaleBand()
			.range([0, width])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var xScaleLineChart2 = d3.scaleBand()
			.range([22, width + 22])
			.domain(data.map(function (d) {
				return d.Name;
			}))
			//.padding(0.05);

		var line = d3.line()
			.x(function(d) { return xScaleLineChart2(d.Name);})
			.y(function(d) { return yScaleLineChart(d.Breast_Expression)})
			.curve(d3.curveMonotoneX)

		svg3.append("path")
			.datum(data)
			.classed("line", true)
			.attr("d", line)

		var x_line_axis = d3.axisBottom(xScaleLineChart)
	    var y_line_axis = d3.axisLeft(yScaleLineChart)

		svg3.append("g")
	    	.call(x_line_axis)
	    	.attr("transform", "translate(0," + (height + 2) + ")")
	    	.classed("x_axis", true)
	    	//.tickCenterLabel(false);
	    	.selectAll("text")
	    	.style("text-anchor", "end")
	    	.attr("y", 0)
	    	.attr("x", -9)
	    	.attr("dy", ".35em")
	    	.attr("transform", "rotate(-65)")
	    	//.style("text-anchor", "start");

	    svg3.append("text")
	    	.attr("transform", "translate(" + width/2 + " ," + (height + 74) + ")")
	    	.attr("text-anchor", "middle")
	    	.text("Gene")
	    	.attr("class", "axis_label");  

	    svg3.append("g")
	    	.call(y_line_axis)
	    	.attr("transform", "translate("+ 0 +", 0)")
	    	.classed("y_axis", true)

	    svg3.append("text")
	    	.attr("transform", "rotate(-90)")
	    	.attr("y", -margin.left*0.7)
	    	.attr("x", -(height/2))
	    	.attr("dy", "2em")
	    	.attr("text-anchor", "middle")
	    	.text("Gene Expression Level")
	    	.attr("class", "axis_label");  

	  	svg3.append("text")
	    	.text("Gene Expression Levels of Important Genes")
	    	.attr("x", width/2)
	    	.attr("y", -20)
	    	.attr("text-anchor", "middle")
	    	.classed("plot_title",true)    	
	    	.attr("id","lineChartTitle")

		svg3.selectAll(".symbol")
		    	.data(data)
		  		.enter()
		  		.append("circle")
		    	.classed("symbol", true)
		    	.attr("cx", function(d) { 
		    		return xScaleLineChart2(d.Name) 
		    	})
		    	.attr("cy", function(d) { 
		    		return yScaleLineChart(d.Breast_Expression) 
		    	})
		    	.attr("r", function(d) {
		    		return 3
		    	})
	});
}
