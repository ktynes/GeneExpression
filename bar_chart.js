const margin = {
	top: 100,
	right: 15,
	left: 100,
	bottom: 50
};
const fullWidth = 850;
const fullHeight = 500;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

var svg = d3.select("body")
	.select("#graph")
	.append("svg")
	.attr("width", fullWidth)
	.attr("height", fullHeight)
	.append("g")
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// definitions for ontology legend
var definitions = ['<b>Cellular Component:</b> the parts of a cell or its extracellular environment.', '<b>Molecular Function:</b> the elemental activities of a gene product at the molecular level, such as binding or catalysis.',
'<b>Biological Process:</b> operations or sets of molecular events with a defined beginning and end, pertinent to the functioning of integrated living units: cells, tissues, organs, and organisms.'];

// format to round data importance
var format = d3.format(".3f");
// threshold to filter data 
var thresholdNumber = 10;
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
	"Gene_importance_complete.csv",
	function (row) {
		row.Lung = +format(row.Lung);		// Here Lung is plotted, change it accordingly everywhere 
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
	.text("Top 10 genes importance by organ: " + "Lung")
	.attr("id", "barChartTitle")
	.attr('x', width / 2)
	.attr('y', 0 - margin.top / 2)
	.style("text-anchor", "middle");

	// add ontology legend
	var ul = d3.select("#graph")
				.append("ul");

	ul.selectAll('li')
		.data(definitions)
		.enter()
		.append('li')
		.html(String);

});
