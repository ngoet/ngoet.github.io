// set the dimensions of the canvas
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

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
  return "<strong>Year:</strong> <span style='color:orange'>" + d.Year + "</span>" + 
  "<br><strong>Polarisation:</strong> <span style='color:orange'>" + Math.round(d.Polarisation * 100) / 100 + "</span>" +
  "<br><strong>Government:</strong> <span style='color:orange'>" + d.Government + "</span>";
  });


svg.call(tip);


// load the data
d3.json("js/polarisationUKHCSO.json", function(error, data) {
    data.forEach(function(d) {
        d.Year = d.Year;
        d.Polarisation = +d.Polarisation;
    });

    x.domain(data.map(function(d) {
        return d.Year;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.Polarisation;
    })).nice();


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
    .attr("y", 0)
    .attr("x", 6)
    .style("font-size","5px")
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Polarisation");

  svg.selectAll(".bar")

      .data(data)

    .enter().append("rect")

      .attr("y", function(d) {

          if (d.Polarisation > 0){
              return Math.abs(y(d.Polarisation));
          } else {
              return Math.abs(y(0));
          }

      })
      .attr("class", "bar")
      .attr("width", x.rangeBand())
        .attr("height", function(d) {
          if (d.Polarisation > 0){
            return Math.abs(y(0)-y(d.Polarisation));
            } else {
              return Math.abs(y(0)-y(d.Polarisation));
          }
        })
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


//sorting values
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Polarisation - a.Polarisation; }
        : function(a, b) { return d3.ascending(a.Year, b.Year); })
        .map(function(d) { return d.Year; }))
        .copy();



    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.Year) - x0(b.Year); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Year); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay)
        .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");
  }
});