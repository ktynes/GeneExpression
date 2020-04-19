var init_dataset;
var aggr_dataset;
var regions = [];
var num_years;
var margin = {top: 20, right: 40, bottom: 20, left: 40}
var page_width = window.innerWidth -  margin.left - margin.right
var page_height = 450 - margin.top - margin.bottom;
var legend_width = 100
var legend_height = 100
var legend_gap = 20
var plot_width = 900 -  margin.left - margin.right - (legend_width + 2*legend_gap)
var plot_height = 300
var axis_to_plot_margin = 3
var axis_to_label = 40
var margin_between_plots = 75
var marker_radius = 4
var legend_offset = 40
var dist_between_markers = 5
var marker_to_label = 5
var signature_margin = 60
var bar_padding = 3

d3.dsv(",", "state-year-earthquakes.csv", function(d) {
    return {
        state: d.state,
        region: d.region,
        year: +d.year,
        count: +d.count
    };
}).then(function(data) {
    init_dataset = data
    temp = d3.nest()
    	.key(function(d) {
    		return d.region; 
    	})
    	.key(function(d) {
    		return d.year; 
    	})
    	.rollup(function(l) {
    		return d3.sum(l, function(k) {
    			return k.count;
    		})
    	})
		.entries(init_dataset)
	console.log(temp)
	aggr_dataset = temp.reduce(function (acc, curr) {
		regions.push(curr.key)
		num_years = curr.values.length
		Array.from(curr.values).forEach(function (l) {
			row = {}
			row.region = curr.key
			row.year = +l.key
			row.count = l.value
			acc.push(row);
		})
	return acc;
	}, []);
    generatePlots()
    console.log(init_dataset)
    console.log(aggr_dataset)
});

var generatePlots = function() {
	
	//Line Chart
	var y_lin_scale = d3.scaleLinear()
		.domain([0,1.2*d3.max(aggr_dataset, function(d){ 
			return Math.max(d.count)})])
		.range([plot_height + margin.top,margin.top])

	var x_scale = d3.scaleTime()
		.domain([d3.min(aggr_dataset, function(d){ return new Date(d.year, 0, 0)}),
			d3.max(aggr_dataset, function(d){ return new Date(d.year, 0, 0)})])
		.range([margin.left,plot_width])

	var svg = d3.select("body")
	   .append("svg")
	   .attr("width",page_width)
	   .attr("height",page_height)
	   .append("g")
	   .attr("transform", "translate("+ margin.left + "," + margin.top + ")")

	var line = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale(d.count)})

	regions.forEach(function(r) {
		svg.append("path")
			.datum(aggr_dataset.filter(function (d){return d.region == r}))
			.classed("line_" + r, true)
			.attr("d", line)

		svg.selectAll(".symbol")
    	.data(aggr_dataset.filter(function (d){return d.region == r}))
  		.enter()
  		.append("circle")
    	.classed("symbol_" + r, true)
    	.attr("cx", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) 
    	})
    	.attr("cy", function(d) { 
    		return y_lin_scale(d.count) 
    	})
    	.attr("r", 2)
    	.on("mouseover", mouseOverFxn)
    	.on("mouseout", mouseOutFxn)
	})

	var x_axis = d3.axisBottom(x_scale)
		.ticks(d3.timeYear.every(1))
    var y_axis = d3.axisLeft(y_lin_scale)

	 svg.append("g")
    	.call(x_axis)
    	.attr("transform", "translate(0," + (plot_height + margin.bottom + axis_to_plot_margin) + ")")
    	.classed("axis", true)


    svg.append("g")
    	.call(y_axis)
    	.attr("transform", "translate("+ (margin.left) +", 0)")
    	.classed("axis", true)

  	svg.append("text")
    	.text("US Earthquakes by Region 2011-2015")
    	.attr("x", plot_width/2)
    	.attr("y", margin.top/2)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)

    	var legend_key = ["Midwest","Northeast","South","West"]
    	var colors = ["red","blue","green","purple"]

   	var color_scale = d3.scaleOrdinal()
   		.domain(legend_key)
   		.range(colors)

   	svg.selectAll("legend_markers")
   		.data(legend_key)
   		.enter()
   		.append("circle")
   		.attr("cx", 2*plot_width/3 + legend_gap)
   		.attr("cy", function(d,i){ 
			return i*(2*marker_radius+dist_between_markers) + legend_offset
		})
		.attr("r", marker_radius)
		.style("fill", function(d) {
			return color_scale(d)
		})

	svg.selectAll("legend_labels")
		.data(legend_key)
		.enter()
		.append("text")
		.attr("x", 2*plot_width/3 + legend_gap + 2*marker_radius + marker_to_label)
		.attr("y", function(d,i) {
			return i*(2*marker_radius+dist_between_markers) + legend_offset
		})
		//.attr("dy","1em")
		.text( function(d) {
			return d
		})
		.attr("text-anchor", "left")
		.attr("dominant-baseline", "central")
		.classed("legend_labels", true)

	svg.append("text")
   		.text("ktynes3")
   		.attr("x", (plot_width + margin.left)/2)
    	.attr("y", legend_offset)
    	.attr("text-anchor", "end")
   		.classed("signature",true)

   	function mouseOverFxn(d) {
   		d3.select(this).attr("r", 6)
   		console.log("mouse_in")
   		build_graph(d)
   	}

   	function mouseOutFxn(d) {
   		d3.select(this).attr("r", 2)
   		console.log("move_out")
   		d3.select('#bar_chart').remove()
   	}

   	function build_graph(d) {

   		var bar_dataset = init_dataset.filter(function (l){
	   			return (d.region == l.region) && (d.year == l.year)
	   		}).sort(function(a, b) {
	   			if (a.count == b.count) {
	   				return a.state - b.state
	   			} else {
	   				return a.count - b.count
	   			}
	   		})
	   	console.log(bar_dataset)
	   	var state_arr = bar_dataset.map(function(d) {return d.state})
	   	console.log(state_arr)

   		var bar_y_scale = d3.scaleLinear()
			.domain([0,bar_dataset.length])
			.range([plot_height + margin.top,margin.top])

		var bar_x_scale = d3.scaleLinear()
			.domain([0,d3.max(bar_dataset, function(d){ return d.count})])
			.range([margin.left,plot_width])

		var ordinal_scale = d3.scaleBand()
			.domain(state_arr)
			.range([plot_height + margin.top,margin.top])

   		var bar_chart = d3.select("body")
		   .append("svg")
		   .attr("width",page_width)
		   .attr("height",page_height)
		   .attr("id","bar_chart")
		   .append("g")
		   .attr("transform", "translate("+ margin.left + "," + margin.top/2 + ")")
		   
   		bar_chart.selectAll("rect")
	        .data(bar_dataset)
	        .enter()
	        .append("rect")
	        .classed("bar", true)
	        .attr("x", margin.left)
	        .attr("y", function(d, i) {
	        	return bar_y_scale(i)
	        })
	        .attr("height", plot_height/bar_dataset.length - bar_padding)
	        .attr("width", function(d) {
	            return bar_x_scale(d.count) - margin.left
	        })

	    var x_axis = d3.axisBottom(bar_x_scale)
	    	//.ticks(d3.timeYear.every(year_gap))
	    var y_axis = d3.axisLeft(ordinal_scale)

	    bar_chart.append("g")
	    	.call(x_axis)
	    	.attr("transform", "translate("+0+"," + (plot_height + margin.top + axis_to_plot_margin + (plot_height/bar_dataset.length - bar_padding)) + ")")
	    	.classed("axis", true)

	    bar_chart.append("g")
	    	.call(y_axis)
	    	.attr("transform", "translate("+ (margin.left) +"," + + (plot_height/bar_dataset.length - bar_padding)+")")
	    	.classed("axis", true)

	   	bar_chart.append("text")
	    	.text(d.region + "ern Region Earthquakes " + d.year)
	    	.attr("x", plot_width/2)
	    	.attr("y", margin.top/2)
	    	.attr("text-anchor", "middle")
	    	.classed("plot_title",true)

   	}
}