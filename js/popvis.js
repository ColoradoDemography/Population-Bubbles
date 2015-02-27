function commafy(nStr) {
	var x, x1, x2, rgx;

	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

dataset = ds[0];

var btnpress = 0;
var year = 1870;
var myVar;
var i;

//Width and height
var w = 850;
var h = 650;
var padding = 60;
var color = d3.scale.category20();

var key = function(d) {
	return d.Name;
};

//Create scale functions
var xScale = d3.scale.log().domain([.1, 8000]).range([padding, w - padding * 2]);

var yScale = d3.scale.linear().domain([65, 0.5]).range([h - padding, padding]);

var pScale = d3.scale.linear().domain([1, 500000]).range([4, 20]);

var formatNumber = d3.format(".2f"), // for formatting integers
formatCurrency = function(d) {
	return formatNumber(d);
};

//Define X axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(0, formatCurrency);

//Define Y axis
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6);

//Create SVG element
var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

d3.select("#xlabel").style("text-anchor", "middle").style("font-weight", "bold").style("font-size", "15px").style("left", parseInt((w / 2) - 170) + "px").style("top", parseInt((h - 10)) + "px").text("Population per Square Mile (Logarithmic Scale)");

d3.select("#ylabel").style("text-anchor", "middle").style("font-weight", 900).style("font-size", "17px").style("left", -80 + "px").style("top", 300 + "px");

d3.select("#toplabel").style("left", 63 + "px").style("top", 70 + "px").style("font-size", "11px").attr("fill", "#888888").text("1");

svg.append("clipPath").attr("id", "chart-area").append("rect").attr("x", padding).attr("y", 0).attr("width", w).attr("height", 800);

//Create circles
svg.append("g").attr("id", "circles").attr("clip-path", "url(#chart-area)").selectAll("circle").data(dataset, key).enter().append("circle").attr("cx", function(d) {
	return xScale(d.Density);
}).attr("cy", function(d) {
	return yScale(d.Rank);
}).attr("r", function(d) {
	return pScale(d.Pop);
}).attr("id", function(d) {
	return d.Name;
}).attr("label", function(d) {
	return d.Label;
}).on("mouseover", function(d) {
	var xPosition = (parseFloat(d3.select(this).attr("cx"))) + 20;
	var yPosition = (parseFloat(d3.select(this).attr("cy"))) + 20;

	d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#dtitle").text(d3.select(this).attr("label"));

	d3.select("#tooltip").select("#value").text("Rank: " + d.Rank);

	d3.select("#tooltip").select("#value2").text("Population: " + commafy(d.Pop));

	var density = parseFloat(d.Density);

	d3.select("#tooltip").select("#value3").text("Density: " + commafy(density.toFixed(1)) + " per SqMi");

	d3.select("#tooltip").classed("hidden", false);

}).on("mouseout", function(d) {
	d3.select("#tooltip").classed("hidden", true);
});

//.append("title")
//.text(function(d){return d.Label+"-  Rank: "+d.Rank+"  Density: "+d.Density+"/SqMi";});

svg.selectAll("text").data(dataset, key).enter().append("text").text(function(d) {
	return d.Label;
}).attr("x", function(d) {
	return xScale(d.Density) + 5;
}).attr("y", function(d) {
	return yScale(d.Rank);
}).attr("id", "texty").attr("clip-path", "url(#chart-area)").attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#888888");

//Create X axis
svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxis).style("fill", "grey");

//Create Y axis
svg.append("g").attr("class", "y axis").attr("transform", "translate(" + padding + ",0)").call(yAxis).style("fill", "grey");

function animateall() {

	clearTimeout(myVar);

	if (btnpress > 0) {
		i = 0;
		year = 1860;
		turndata(ds[0], year, 0);
	} else {
		i = 1;
		year = 1870;
		turndata(ds[1], year, 0);
	}

	myVar = setInterval(function() {
		turndata(ds[i], year, 0);
	}, 2000);

};

function turndata(dataset, newyear, purpose) {
	i = i + 1;
	year = year + 10;

	if (newyear == 1870) {
		btnpress = 0;
	} else {
		btnpress = 1;
	};

	if (purpose == 1) {
		clearTimeout(myVar);
	}

	//Update all circles
	svg.selectAll("circle").data(dataset, key).transition().duration(2000).ease("linear").each("start", function() {
	}).attr("cx", function(d) {
		return xScale(d.Density);
	}).attr("cy", function(d) {
		return yScale(d.Rank);
	}).attr("r", function(d) {
		return pScale(d.Pop);
	});

	svg.selectAll("text").data(dataset, key).transition().duration(2000).ease("linear").each("start", function() {
	}).attr("x", function(d) {
		return xScale(d.Density) + 5;
	}).attr("y", function(d) {
		return yScale(d.Rank);
	});

	if (purpose == 0) {
		newyear = year;
	}

	setTimeout(function() {
		document.getElementById('year').innerHTML = newyear;
	}, 2000);

	if (i > 17) {
		clearTimeout(myVar);
	}

};
