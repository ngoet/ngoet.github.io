// set the dimensions of the canvas
var margin = {top: 50, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .05);

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
  return "<strong>Question: </strong>" + d.Question + "<br><strong>Average time spent: </strong>" + Math.round(d.avgTime * 100) / 100 + " seconds";
  
  });


svg.call(tip);



// load the data
d3.json("js/sampleDataAvgTime.json", function(error, data) {
    data.forEach(function(d) {
        d.Question = d.Question;
        d.avgTime = +d.avgTime;
    });

    x.domain(data.map(function(d) {
        return d.Question;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.avgTime;
    })).nice();

  
  // scale the range of the data
  // x.domain(data.map(function(d) { return d.Question; }));
  // y.domain([0, d3.max(data, function(d) { return d.avgTime; })]);
 
        

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("avgTime");

  svg.selectAll(".bar")

      .data(data)

    .enter().append("rect")

      .attr("y", function(d) {

          if (d.avgTime > 0){
              return Math.abs(y(d.avgTime));
          } else {
              return Math.abs(y(0));
          }

      })
      .attr("class", "bar")
      .attr("width", x.rangeBand())
        .attr("height", function(d) {
          if (d.avgTime > 0){
            return Math.abs(y(0)-y(d.avgTime));
            } else {
              return Math.abs(y(0)-y(d.avgTime));
          }
        })
      .attr("x", function(d) { return x(d.Question); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      // .attr("y", function(d) { return y(d.avgTime); })
      // .attr("height", function(d) { return height - y(d.avgTime); });



//sorting values
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.avgTime - a.avgTime; }
        : function(a, b) { return d3.ascending(a.Question, b.Question); })
        .map(function(d) { return d.Question; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.Question) - x0(b.Question); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Question); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});