// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
  return "<strong>Discrimination:</strong> <span style='color:orange'>" + Math.round(d.Discrimination * 100) / 100 + "</span>";
  });


svg.call(tip);


// load the data
d3.json("sampleData.json", function(error, data) {
    data.forEach(function(d) {
        d.Question = d.Question;
        d.Discrimination = +d.Discrimination;
    });

    x.domain(data.map(function(d) {
        return d.Question;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.Discrimination;
    })).nice();

  
  // scale the range of the data
  // x.domain(data.map(function(d) { return d.Question; }));
  // y.domain([0, d3.max(data, function(d) { return d.Discrimination; })]);
 
        

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
      .text("Discrimination");

  svg.selectAll(".bar")

      .data(data)

    .enter().append("rect")

      .attr("y", function(d) {

          if (d.Discrimination > 0){
              return Math.abs(y(d.Discrimination));
          } else {
              return Math.abs(y(0));
          }

      })
      .attr("class", "bar")
      .attr("width", x.rangeBand())
        .attr("height", function(d) {
          if (d.Discrimination > 0){
            return Math.abs(y(0)-y(d.Discrimination));
            } else {
              return Math.abs(y(0)-y(d.Discrimination));
          }
        })
      .attr("x", function(d) { return x(d.Question); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      // .attr("y", function(d) { return y(d.Discrimination); })
      // .attr("height", function(d) { return height - y(d.Discrimination); });



//horizontal line
 var lineEnd = 0;

   svg.append("line")
    .attr("x1",-6)
    .attr("y1",y(0))//so that the line passes through the y 0
    .attr("x2",width)
    .attr("y2",y(0))//so that the line passes through the y 0
    .attr("stroke-width", 2)
    .style("stroke", "red");
  

//sorting values
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Discrimination - a.Discrimination; }
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