const margin = {
	top: 50,
	right: 15,
	left: 200,
	bottom: 50
};
const fullWidth = 600; //850
const fullHeight = 800; //1000
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

// format to round data importance
var format = d3.format(".3f");
// threshold to filter data 
var threshold = 0.001;
// tip tool
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([35, 300])
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
	"Gene_Importance.csv",
	function (row) {
		row.Kidney = +format(row.Kidney);		// Here Kidney is plotted, change it accordingly everywhere except in the definition of 'Others' (Line50)
		return row;
	}
).then((data) => {			
	
	var originalDataLength = data.length;

	// filter data to keep only importance > threshold
	data = data.filter(function(d, i) { 
		return d.Kidney > threshold ; });
	
	// add Others for all genes with importance <= threshold. DO NOT change this definition
	data.push({Gene: (originalDataLength - data.length) + ' Others', Blood: 0.001, Breast: 0.001, Kidney: 0.001, Lung: 0.001, Ontology: 'Importance <= ' + threshold });

	// order data 		
	data = data.sort((a, b) => d3.ascending(format(a.Kidney), format(b.Kidney)));

	// max importance
	maxCount = d3.max(data, function (d) { return Number(d.Kidney); });

	// x and y scales and axis
	var xScaleBarChart = d3.scaleLinear()
	.domain([0, maxCount])
	.range([0, width]);

	var yScaleBarChart = d3.scaleBand()
		.range([height, 0])
		.domain(data.map(function (d) {
			return d.Gene;
		}))
		.padding(0.05);

	var xAxis = d3.axisTop(xScaleBarChart);
	var yAxis = d3.axisLeft(yScaleBarChart);

	svg.append("g")
		.classed('x axis', true)
		.call(xAxis);

	svg.append("g")
		.classed('y axis', true)
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
			return yScaleBarChart(d.Gene);
		})
		.attr("width", (d) => {
			return xScaleBarChart(d.Kidney);
		})
		.attr("height", yScaleBarChart.bandwidth())
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	//add bar chart title
	svg.append("text")
	.text("Genes importance by organ: " + "Kidney")
	.attr("id", "barChartTitle")
	.attr('x', width / 2)
	.attr('y', 0 - margin.top / 2)
	.style("text-anchor", "middle");

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

            kidney.style.fill = "rgb(169,169, 169)"
            setTimeout(() => {
                kidney.style.fill = kidney.oriColor
            }, 100);
            
        }).on("mouseover", function (d) {
            if (!kidney) {
                kidney = this
                kidney.oriColor = kidney.style.fill
                
            }
            d3.select(this).style("fill", "rgb(255,127,80)")
            clickedOnKidney()
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", kidney.oriColor)
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
		"Gene_Importance.csv",
		function (row) {
			row.Kidney = +format(row.Kidney);		// Here Kidney is plotted, change it accordingly everywhere except in the definition of 'Others' (Line50)
			return row;
		}
	).then((data) => {			
		
		var originalDataLength = data.length;

		// filter data to keep only importance > threshold
		data = data.filter(function(d, i) { 
			return d.Kidney > threshold ; });
		
		// add Others for all genes with importance <= threshold. DO NOT change this definition
		data.push({Gene: (originalDataLength - data.length) + ' Others', Blood: 0.001, Breast: 0.001, Kidney: 0.001, Lung: 0.001, Ontology: 'Importance <= ' + threshold });

		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Kidney), format(b.Kidney)));

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Kidney); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Gene;
			}))
			.padding(0.05);

		var xAxis = d3.axisTop(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x axis', true)
			.call(xAxis);

		svg.append("g")
			.classed('y axis', true)
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
				return yScaleBarChart(d.Gene);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Kidney);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Genes importance by organ: " + "Kidney")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 2)
		.style("text-anchor", "middle");

	});
}

function clickedOnHema() {
	console.log("Blood")
	d3.select('#bar_chart').remove()

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
		"Gene_Importance.csv",
		function (row) {
			row.Blood = +format(row.Blood);		// Here Kidney is plotted, change it accordingly everywhere except in the definition of 'Others' (Line50)
			return row;
		}
	).then((data) => {			
		
		var originalDataLength = data.length;

		// filter data to keep only importance > threshold
		data = data.filter(function(d, i) { 
			return d.Blood > threshold ; });
		
		// add Others for all genes with importance <= threshold. DO NOT change this definition
		data.push({Gene: (originalDataLength - data.length) + ' Others', Blood: 0.001, Breast: 0.001, Kidney: 0.001, Lung: 0.001, Ontology: 'Importance <= ' + threshold });

		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Blood), format(b.Blood)));

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Blood); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Gene;
			}))
			.padding(0.05);

		var xAxis = d3.axisTop(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x axis', true)
			.call(xAxis);

		svg.append("g")
			.classed('y axis', true)
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
				return yScaleBarChart(d.Gene);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Blood);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Genes importance by organ: " + "Blood")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 2)
		.style("text-anchor", "middle");

	});
}

function clickedOnLung() {
	console.log("Lung")
	d3.select('#bar_chart').remove()

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
		"Gene_Importance.csv",
		function (row) {
			row.Lung = +format(row.Lung);		// Here Kidney is plotted, change it accordingly everywhere except in the definition of 'Others' (Line50)
			return row;
		}
	).then((data) => {			
		
		var originalDataLength = data.length;

		// filter data to keep only importance > threshold
		data = data.filter(function(d, i) { 
			return d.Lung > threshold ; });
		
		// add Others for all genes with importance <= threshold. DO NOT change this definition
		data.push({Gene: (originalDataLength - data.length) + ' Others', Blood: 0.001, Breast: 0.001, Kidney: 0.001, Lung: 0.001, Ontology: 'Importance <= ' + threshold });

		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Lung), format(b.Lung)));

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Lung); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Gene;
			}))
			.padding(0.05);

		var xAxis = d3.axisTop(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x axis', true)
			.call(xAxis);

		svg.append("g")
			.classed('y axis', true)
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
				return yScaleBarChart(d.Gene);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Lung);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Genes importance by organ: " + "Lung")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 2)
		.style("text-anchor", "middle");

	});
}

function clickedOnBreast() {
	console.log("Breast")
	d3.select('#bar_chart').remove()

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
		"Gene_Importance.csv",
		function (row) {
			row.Breast = +format(row.Breast);		// Here Kidney is plotted, change it accordingly everywhere except in the definition of 'Others' (Line50)
			return row;
		}
	).then((data) => {			
		
		var originalDataLength = data.length;

		// filter data to keep only importance > threshold
		data = data.filter(function(d, i) { 
			return d.Breast > threshold ; });
		
		// add Others for all genes with importance <= threshold. DO NOT change this definition
		data.push({Gene: (originalDataLength - data.length) + ' Others', Blood: 0.001, Breast: 0.001, Kidney: 0.001, Lung: 0.001, Ontology: 'Importance <= ' + threshold });

		// order data 		
		data = data.sort((a, b) => d3.ascending(format(a.Breast), format(b.Breast)));

		// max importance
		maxCount = d3.max(data, function (d) { return Number(d.Breast); });

		// x and y scales and axis
		var xScaleBarChart = d3.scaleLinear()
		.domain([0, maxCount])
		.range([0, width]);

		var yScaleBarChart = d3.scaleBand()
			.range([height, 0])
			.domain(data.map(function (d) {
				return d.Gene;
			}))
			.padding(0.05);

		var xAxis = d3.axisTop(xScaleBarChart);
		var yAxis = d3.axisLeft(yScaleBarChart);

		svg.append("g")
			.classed('x axis', true)
			.call(xAxis);

		svg.append("g")
			.classed('y axis', true)
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
				return yScaleBarChart(d.Gene);
			})
			.attr("width", (d) => {
				return xScaleBarChart(d.Breast);
			})
			.attr("height", yScaleBarChart.bandwidth())
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		//add bar chart title
		svg.append("text")
		.text("Genes importance by organ: " + "Breast")
		.attr("id", "barChartTitle")
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 2)
		.style("text-anchor", "middle");

	});
}
