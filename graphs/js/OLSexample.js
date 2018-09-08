// set the dimensions of the canvas
var reg;

var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 780 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
  return "<strong>X:</strong> <span style='color:orange'>" + d.X + "</span>" + 
  "<br><strong>Y:</strong> <span style='color:orange'>" + Math.round(d.Y * 100) / 100;
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.call(tip);

// load the data
d3.json("js/OLSdata.json", function(error, data) {
    data.forEach(function(d) {
        d.X = d.X;
        d.Y = Math.random();
    });

    x.domain(data.map(function(d) {
        return d.X;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.Y;
    
    })).nice();

var xAxDat = data.map(function(d) { return d.X; });
    var yAxDat = data.map(function(d) { return d.Y; });
    
    reg=OLS(xAxDat,yAxDat);

    var line = d3.svg.line()
    .x(function(d) { return x(d.X); })
    .y(function(d) { return y(reg(d.X)); 
    });


   svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y")
    .append("path");
      
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("opacity",0.5)
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.X); })
      .attr("cy", function(d) { return y(d.Y); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
      
  
      });

function render(){
  

var reg;

var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 780 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
  return "<strong>X:</strong> <span style='color:orange'>" + d.X + "</span>" + 
  "<br><strong>Y:</strong> <span style='color:orange'>" + Math.round(d.Y * 100) / 100;
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.call(tip);

// load the data
d3.json("js/OLSdata.json", function(error, data) {
    data.forEach(function(d) {
        d.X = d.X;
        d.Y = Math.random();
    });

    x.domain(data.map(function(d) {
        return d.X;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.Y;
    
    })).nice();

var xAxDat = data.map(function(d) { return d.X; });
    var yAxDat = data.map(function(d) { return d.Y; });
    
    reg=OLS(xAxDat,yAxDat);

    var line = d3.svg.line()
    .x(function(d) { return x(d.X); })
    .y(function(d) { return y(reg(d.X)); 
    });


   svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y")
    .append("path");
      
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("opacity",0.5)
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.X); })
      .attr("cy", function(d) { return y(d.Y); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
      
  
      });



}

function updateData() {
  d3.select("svg").remove();

render();

};

function OLS(xAxDat, yAxDat) {
    var ReduceAddition = function(prev, cur) { return prev + cur; };
    
    // finding the mean of Xaxis and Yaxis data
    var xMean = xAxDat.reduce(ReduceAddition) * 1.0 / xAxDat.length;
    var yMean = yAxDat.reduce(ReduceAddition) * 1.0 / yAxDat.length;

     var ssYY = yAxDat.map(function(d) { return Math.pow(d - yMean, 2); })
      .reduce(ReduceAddition);

    var XX2 = xAxDat.map(function(d) { return Math.pow(d - xMean, 2); })
      .reduce(ReduceAddition);
      
    var xyMeanDelta = xAxDat.map(function(d, i) { return (d - xMean) * (yAxDat[i] - yMean); })
      .reduce(ReduceAddition);
      
    var b = xyMeanDelta / XX2;
    var a0 = yMean - (xMean * b);
    
// returning regression function
    return function(x){
      return x*b+a0
    }

  }



