const margin = {
	top: 100,
	right: 15,
	left: 200,
	bottom: 50
};
const fullWidth = 850;
const fullHeight = 1000;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
