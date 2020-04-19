var dataset;
// var plot_x = 100
// var plot_y = 100
var margin = {top: 50, right: 50, bottom: 50, left: 50}
var page_width = window.innerWidth -  margin.left - margin.right
var page_height = 2000 - margin.top - margin.bottom;
var legend_width = 100
var legend_height = 100
var legend_gap = 20
var plot_width = window.innerWidth -  margin.left - margin.right - (legend_width + 2*legend_gap)
var plot_height = 300
var axis_to_plot_margin = 3
var axis_to_label = 40
var margin_between_plots = 150
var marker_width = 30
var marker_height = 20
var dist_between_markers = 5
var marker_to_label = 5
var signature_margin = 60

d3.dsv(",", "earthquakes.csv", function(d) {
    return {
        year: +d.year,
        eight_plus: +d["8.0+"],
        sevens: +d["7_7.9"],
        sixes: +d["6_6.9"],
        fives: +d["5_5.9"],
       	num_deaths: +d["Estimated Deaths"]
    };
}).then(function(data) {
    dataset = data
    generatePlots()
    console.log(dataset);

});

var generatePlots = function() {
	
	//First Plot
	var y_lin_scale = d3.scaleLinear()
		.domain([0,d3.max(dataset, function(d){ 
			return Math.max(d.eight_plus,d.sevens,d.sixes,d.fives)})])
		.range([plot_height + margin.top,margin.top])

	var x_scale = d3.scaleTime()
		.domain([d3.min(dataset, function(d){ return new Date(d.year, 0, 0)}),
			d3.max(dataset, function(d){ return new Date(d.year, 0, 0)})])
		.range([margin.left,plot_width])

	var svg = d3.select("body")
	   .append("svg")
	   .attr("width",page_width)
	   .attr("height",page_height)
	   .append("g")
	   .attr("transform", "translate("+ margin.left + "," + margin.top + ")")

	var five_line = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale(d.fives)})
		.curve(d3.curveMonotoneX)

	var six_line = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale(d.sixes)})
		.curve(d3.curveMonotoneX)

	var seven_line = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale(d.sevens)})
		.curve(d3.curveMonotoneX)

	var eight_line = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale(d.eight_plus)})
		.curve(d3.curveMonotoneX)

	svg.append("path")
		.datum(dataset)
		.classed("five_line", true)
		.attr("d", five_line)

	svg.append("path")
		.datum(dataset)
		.classed("six_line", true)
		.attr("d", six_line)

	svg.append("path")
		.datum(dataset)
		.classed("seven_line", true)
		.attr("d", seven_line)

	svg.append("path")
		.datum(dataset)
		.classed("eight_line", true)
		.attr("d", eight_line)

	var x_axis = d3.axisBottom(x_scale)
    var y_axis = d3.axisLeft(y_lin_scale)

	 svg.append("g")
    	.call(x_axis)
    	.attr("transform", "translate(0," + (plot_height + margin.bottom + axis_to_plot_margin) + ")")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "translate(" + plot_width/2 + " ," + (plot_height + margin.top + axis_to_plot_margin + axis_to_label) + ")")
    	.attr("text-anchor", "middle")
    	.text("Year")

    svg.append("g")
    	.call(y_axis)
    	.attr("transform", "translate("+ (margin.left) +", 0)")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -margin.left/2)
    	.attr("x", -(plot_height/2 + margin.top))
    	.attr("dy", "2em")
    	.attr("text-anchor", "middle")
    	.text("Num of Earthquakes");

  	svg.append("text")
    	.text("Earthquake Statistics for 2000-2015")
    	.attr("x", plot_width/2)
    	.attr("y", margin.top/2)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)

   	var legend_key = ["5_5.9","6_6.9","7_7.9","8.0+"]
   	var colors = ["#FFC300","#FF5733","#C70039","#900C3F"]

   	var color_scale = d3.scaleOrdinal()
   		.domain(legend_key)
   		.range(colors)

   	svg.selectAll("legend_markers")
   		.data(legend_key)
   		.enter()
   		.append("rect")
   		.attr("x", plot_width + legend_gap)
   		.attr("y", function(d,i){ 
			return i*(marker_height+dist_between_markers)
		})
		.attr("width", marker_width)
		.attr("height", marker_height)
		.style("fill", function(d) {
			return color_scale(d)
		})

	svg.selectAll("legend_labels")
		.data(legend_key)
		.enter()
		.append("text")
		.attr("x", plot_width + legend_gap + marker_width + marker_to_label)
		.attr("y", function(d,i) {
			return i*(marker_height+dist_between_markers)
		})
		.attr("dy","1em")
		.text( function(d) {
			return d
		})
		.attr("text-anchor", "left")

	//var page_break = document.createElement('div')
	//page_break.className = "pagebreak"
	//document.appendChild(page_break);
	//second plot

	var y_lin_scale2 = d3.scaleLinear()
		.domain([0,d3.max(dataset, function(d){ 
			return Math.max(d.eight_plus,d.sevens,d.sixes,d.fives)})])
		.range([2*plot_height + margin.top + margin_between_plots, plot_height + margin.top + margin_between_plots])

	var five_line2 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale2(d.fives)})
		.curve(d3.curveMonotoneX)

	var six_line2 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale2(d.sixes)})
		.curve(d3.curveMonotoneX)

	var seven_line2 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale2(d.sevens)})
		.curve(d3.curveMonotoneX)

	var eight_line2 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_lin_scale2(d.eight_plus)})
		.curve(d3.curveMonotoneX)

	svg.append("path")
		.datum(dataset)
		.classed("five_line", true)
		.attr("d", five_line2)

	svg.append("path")
		.datum(dataset)
		.classed("six_line", true)
		.attr("d", six_line2)

	svg.append("path")
		.datum(dataset)
		.classed("seven_line", true)
		.attr("d", seven_line2)

	svg.append("path")
		.datum(dataset)
		.classed("eight_line", true)
		.attr("d", eight_line2)


	min_r = 3
	max_r = 8
	min_sz = 3
	max_sz = 12

	var r_scale = d3.scaleLinear()
	    .domain([d3.min(dataset, function(d) {
	    	return d.num_deaths
	    }),d3.max(dataset, function(d) {
	    	return d.num_deaths
	    })])
	    .range([min_r,max_r])

	var sz_scale = d3.scaleLinear()
	    .domain([d3.min(dataset, function(d) {
	    	return d.num_deaths
	    }),d3.max(dataset, function(d) {
	    	return d.num_deaths
	    })])
	    .range([min_sz,max_sz])

	svg.selectAll(".five_symbol")
    	.data(dataset)
  		.enter()
  		.append("circle")
    	.classed("five_symbol", true)
    	.attr("cx", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) 
    	})
    	.attr("cy", function(d) { 
    		return y_lin_scale2(d.fives) 
    	})
    	.attr("r", function(d) {
    		return r_scale(d.num_deaths)
    	})

    svg.selectAll(".six_symbol")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("six_symbol", true)
    	.attr('transform', function(d) {
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + y_lin_scale2(d.sixes) + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolTriangle))

    svg.selectAll(".seven_symbol")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("seven_symbol", true)
    	.attr('transform', function(d) {
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + y_lin_scale2(d.sevens) + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolDiamond))

	svg.selectAll(".eight_symbol")
    	.data(dataset)
  		.enter()
  		.append("rect")
    	.classed("eight_symbol", true)
    	.attr("x", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) - sz_scale(d.num_deaths)/2
    	})
    	.attr("y", function(d) { 
    		return y_lin_scale2(d.eight_plus) - sz_scale(d.num_deaths)/2
    	})
    	.attr("width", function(d) {
    		return sz_scale(d.num_deaths)
    	})
    	.attr("height", function(d) {
    		return sz_scale(d.num_deaths)
    	})

	var x_axis2 = d3.axisBottom(x_scale)
    var y_axis2 = d3.axisLeft(y_lin_scale2)

	svg.append("g")
    	.call(x_axis2)
    	.attr("transform", "translate(0," + (2*plot_height + margin.top+ margin_between_plots + axis_to_plot_margin) + ")")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "translate(" + plot_width/2 + " ," + (2*plot_height + margin.top + axis_to_plot_margin + axis_to_label + margin_between_plots) + ")")
    	.attr("text-anchor", "middle")
    	.text("Year")

    svg.append("g")
    	.call(y_axis2)
    	.attr("transform", "translate("+ (margin.left) +", 0)")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -margin.left/2)
    	.attr("x", -(1.5*plot_height + margin.top + margin_between_plots))
    	.attr("dy", "2em")
    	.attr("text-anchor", "middle")
    	.text("Num of Earthquakes");

  	svg.append("text")
    	.text("Earthquake Statistics for 2000-2015 with Symbols")
    	.attr("x", plot_width/2)
    	.attr("y", margin.top/2 + plot_height + margin_between_plots)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)

   	var legend_key = ["5_5.9","6_6.9","7_7.9","8.0+"]
   	var colors = ["#FFC300","#FF5733","#C70039","#900C3F"]

   	var color_scale = d3.scaleOrdinal()
   		.domain(legend_key)
   		.range(colors)

   	svg.selectAll("legend_markers")
   		.data(legend_key)
   		.enter()
   		.append("rect")
   		.attr("x", plot_width + legend_gap)
   		.attr("y", function(d,i){ 
			return plot_height + margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("width", marker_width)
		.attr("height", marker_height)
		.style("fill", function(d) {
			return color_scale(d)
		})

	svg.selectAll("legend_labels")
		.data(legend_key)
		.enter()
		.append("text")
		.attr("x", plot_width + legend_gap + marker_width + marker_to_label)
		.attr("y", function(d,i) {
			return plot_height + margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("dy","1em")
		.text( function(d) {
			return d
		})

	//third plot

	var y_sqrt_scale = d3.scaleSqrt()
		.domain([0,d3.max(dataset, function(d){ 
			return Math.max(d.eight_plus,d.sevens,d.sixes,d.fives)})])
		.range([3*plot_height + margin.top + 2*margin_between_plots, 2*plot_height + margin.top + 2*margin_between_plots])

	var five_line3 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_sqrt_scale(d.fives)})
		.curve(d3.curveMonotoneX)

	var six_line3 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_sqrt_scale(d.sixes)})
		.curve(d3.curveMonotoneX)

	var seven_line3 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_sqrt_scale(d.sevens)})
		.curve(d3.curveMonotoneX)

	var eight_line3 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { return y_sqrt_scale(d.eight_plus)})
		.curve(d3.curveMonotoneX)

	svg.append("path")
		.datum(dataset)
		.classed("five_line", true)
		.attr("d", five_line3)

	svg.append("path")
		.datum(dataset)
		.classed("six_line", true)
		.attr("d", six_line3)

	svg.append("path")
		.datum(dataset)
		.classed("seven_line", true)
		.attr("d", seven_line3)

	svg.append("path")
		.datum(dataset)
		.classed("eight_line", true)
		.attr("d", eight_line3)


	min_r = 3
	max_r = 8
	min_sz = 3
	max_sz = 12

	svg.selectAll(".five_symbol2")
    	.data(dataset)
  		.enter()
  		.append("circle")
    	.classed("five_symbol", true)
    	.attr("cx", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) 
    	})
    	.attr("cy", function(d) { 
    		return y_sqrt_scale(d.fives) 
    	})
    	.attr("r", function(d) {
    		return r_scale(d.num_deaths)
    	})

    svg.selectAll(".six_symbol2")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("six_symbol", true)
    	.attr('transform', function(d) {
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + y_sqrt_scale(d.sixes) + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolTriangle))

    svg.selectAll(".seven_symbol2")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("seven_symbol", true)
    	.attr('transform', function(d) {
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + y_sqrt_scale(d.sevens) + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolDiamond))

	svg.selectAll(".eight_symbol2")
    	.data(dataset)
  		.enter()
  		.append("rect")
    	.classed("eight_symbol", true)
    	.attr("x", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) - sz_scale(d.num_deaths)/2
    	})
    	.attr("y", function(d) { 
    		return y_sqrt_scale(d.eight_plus) - sz_scale(d.num_deaths)/2
    	})
    	.attr("width", function(d) {
    		return sz_scale(d.num_deaths)
    	})
    	.attr("height", function(d) {
    		return sz_scale(d.num_deaths)
    	})

	var x_axis3 = d3.axisBottom(x_scale)
    var y_axis3 = d3.axisLeft(y_sqrt_scale)

	svg.append("g")
    	.call(x_axis3)
    	.attr("transform", "translate(0," + (3*plot_height + margin.top+ 2*margin_between_plots + axis_to_plot_margin) + ")")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "translate(" + plot_width/2 + " ," + (3*plot_height + margin.top + axis_to_plot_margin + axis_to_label + 2*margin_between_plots) + ")")
    	.attr("text-anchor", "middle")
    	.text("Year")

    svg.append("g")
    	.call(y_axis3)
    	.attr("transform", "translate("+ (margin.left) +", 0)")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -margin.left/2)
    	.attr("x", -(2.5*plot_height + margin.top + 2*margin_between_plots))
    	.attr("dy", "2em")
    	.attr("text-anchor", "middle")
    	.text("Num of Earthquakes");

  	svg.append("text")
    	.text("Earthquake Statistics for 2000-2015 (Square root Scale)")
    	.attr("x", plot_width/2)
    	.attr("y", margin.top/2 + 2*plot_height + 2*margin_between_plots)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)

   	var legend_key = ["5_5.9","6_6.9","7_7.9","8.0+"]
   	var colors = ["#FFC300","#FF5733","#C70039","#900C3F"]

   	var color_scale = d3.scaleOrdinal()
   		.domain(legend_key)
   		.range(colors)

   	svg.selectAll("legend_markers")
   		.data(legend_key)
   		.enter()
   		.append("rect")
   		.attr("x", plot_width + legend_gap)
   		.attr("y", function(d,i){ 
			return 2*plot_height + 2*margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("width", marker_width)
		.attr("height", marker_height)
		.style("fill", function(d) {
			return color_scale(d)
		})

	svg.selectAll("legend_labels")
		.data(legend_key)
		.enter()
		.append("text")
		.attr("x", plot_width + legend_gap + marker_width + marker_to_label)
		.attr("y", function(d,i) {
			return 2*plot_height + 2*margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("dy","1em")
		.text( function(d) {
			return d
		})

	//fourth plot

	min_y = 4*plot_height + margin.top + 3*margin_between_plots
	var y_log_scale = d3.scaleLog()
		.domain([1,d3.max(dataset, function(d){ 
			return Math.max(d.eight_plus,d.sevens,d.sixes,d.fives)})])
		.range([4*plot_height + margin.top + 3*margin_between_plots, 3*plot_height + margin.top + 3*margin_between_plots])

	var five_line4 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { if (d.fives == 0) {return min_y} return y_log_scale(d.fives)})
		.curve(d3.curveMonotoneX)

	var six_line4 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { if (d.sixes == 0) {return min_y} return y_log_scale(d.sixes)})
		.curve(d3.curveMonotoneX)

	var seven_line4 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { if (d.sevens == 0) {return min_y} return y_log_scale(d.sevens)})
		.curve(d3.curveMonotoneX)

	var eight_line4 = d3.line()
		.x(function(d) { return x_scale(new Date(d.year, 0, 0));})
		.y(function(d) { if (d.eight_plus == 0) {return min_y} return y_log_scale(d.eight_plus)})
		.curve(d3.curveMonotoneX)

	svg.append("path")
		.datum(dataset)
		.classed("five_line", true)
		.attr("d", five_line4)

	svg.append("path")
		.datum(dataset)
		.classed("six_line", true)
		.attr("d", six_line4)

	svg.append("path")
		.datum(dataset)
		.classed("seven_line", true)
		.attr("d", seven_line4)

	svg.append("path")
		.datum(dataset)
		.classed("eight_line", true)
		.attr("d", eight_line4)


	min_r = 3
	max_r = 8
	min_sz = 3
	max_sz = 12

	svg.selectAll(".five_symbol3")
    	.data(dataset)
  		.enter()
  		.append("circle")
    	.classed("five_symbol", true)
    	.attr("cx", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) 
    	})
    	.attr("cy", function(d) { 
    		if (d.fives == 0) {return min_y} return y_log_scale(d.fives) 
    	})
    	.attr("r", function(d) {
    		return r_scale(d.num_deaths)
    	})

    svg.selectAll(".six_symbol3")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("six_symbol", true)
    	.attr('transform', function(d) {
    		if (d.sixes == 0) { 
    			val = min_y
    		} else {
    			val = y_log_scale(d.sixes)
    		} 
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + val + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolTriangle))

    svg.selectAll(".seven_symbol3")
    	.data(dataset)
  		.enter()
  		.append("path")
    	.classed("seven_symbol", true)
    	.attr('transform', function(d) {
    		if (d.sevens == 0) { 
    			val = min_y
    		} else {
    			val = y_log_scale(d.sevens)
    		} 
    		return "translate(" + x_scale(new Date(d.year, 0, 0)) + "," + val + ")";
  		})
  		.attr("d", d3.symbol()
		.size(function(d) {
    		return sz_scale(d.num_deaths)*sz_scale(d.num_deaths)
    	})
    	.type(d3.symbolDiamond))

	svg.selectAll(".eight_symbol3")
    	.data(dataset)
  		.enter()
  		.append("rect")
    	.classed("eight_symbol", true)
    	.attr("x", function(d) { 
    		return x_scale(new Date(d.year, 0, 0)) - sz_scale(d.num_deaths)/2
    	})
    	.attr("y", function(d) { 
    		if (d.eight_plus == 0) { return min_y - sz_scale(d.num_deaths)/2} return y_log_scale(d.eight_plus) - sz_scale(d.num_deaths)/2
    	})
    	.attr("width", function(d) {
    		return sz_scale(d.num_deaths)
    	})
    	.attr("height", function(d) {
    		return sz_scale(d.num_deaths)
    	})

	var x_axis4 = d3.axisBottom(x_scale)
    var y_axis4 = d3.axisLeft(y_log_scale)

	svg.append("g")
    	.call(x_axis4)
    	.attr("transform", "translate(0," + (4*plot_height + margin.top+ 3*margin_between_plots + axis_to_plot_margin) + ")")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "translate(" + plot_width/2 + " ," + (4*plot_height + margin.top + axis_to_plot_margin + axis_to_label + 3*margin_between_plots) + ")")
    	.attr("text-anchor", "middle")
    	.text("Year")

    svg.append("g")
    	.call(y_axis4)
    	.attr("transform", "translate("+ (margin.left) +", 0)")
    	.classed("axis", true)

    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -margin.left/2)
    	.attr("x", -(3.5*plot_height + margin.top + 3*margin_between_plots))
    	.attr("dy", "2em")
    	.attr("text-anchor", "middle")
    	.text("Num of Earthquakes");

  	svg.append("text")
    	.text("Earthquake Statistics for 2000-2015 (Log Scale)")
    	.attr("x", plot_width/2)
    	.attr("y", margin.top/2 + 3*plot_height + 3*margin_between_plots)
    	.attr("text-anchor", "middle")
    	.classed("plot_title",true)

   	var legend_key = ["5_5.9","6_6.9","7_7.9","8.0+"]
   	var colors = ["#FFC300","#FF5733","#C70039","#900C3F"]

   	var color_scale = d3.scaleOrdinal()
   		.domain(legend_key)
   		.range(colors)

   	svg.selectAll("legend_markers")
   		.data(legend_key)
   		.enter()
   		.append("rect")
   		.attr("x", plot_width + legend_gap)
   		.attr("y", function(d,i){ 
			return 3*plot_height + 3*margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("width", marker_width)
		.attr("height", marker_height)
		.style("fill", function(d) {
			return color_scale(d)
		})

	svg.selectAll("legend_labels")
		.data(legend_key)
		.enter()
		.append("text")
		.attr("x", plot_width + legend_gap + marker_width + marker_to_label)
		.attr("y", function(d,i) {
			return 3*plot_height + 3*margin_between_plots + i*(marker_height+dist_between_markers)
		})
		.attr("dy","1em")
		.text( function(d) {
			return d
		})

	   	svg.append("text")
   		.text("ktynes3")
   		.attr("x", plot_width - margin.right/2)
    	.attr("y", 4*plot_height + margin.top + 3*margin_between_plots + signature_margin)
    	.attr("text-anchor", "end")
   		.classed("signature",true)
}