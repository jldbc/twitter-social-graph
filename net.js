var w = 850,
    h = 600,
    fill = d3.scale.category20();

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json("data.json", function(json) {
  var force = d3.layout.force()
      .charge(-500)
      .linkDistance(50)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  var node = vis.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 3)
      .style("fill", function(d) { return fill(d.group); })
      .call(force.drag)
      .on('dblclick', connectedNodes); 




  /*
  node.append("svg:title")
    .attr("dx", ".10em")
    .attr("dy", ".10em")
    .text(function(d) { return d.name; })
    .style("stroke", "gray");;
  */

  node.append("svg:title")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
        

  vis.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

  });




  //Toggle stores whether the highlighting is on
  var toggle = 0;
  //Create an array logging what is connected to what
  var linkedByIndex = {};
  for (i = 0; i < node[0].length; i++) {
      linkedByIndex[i + "," + i] = 1;
  };
  console.log(node[0])
  console.log(linkedByIndex)
  console.log(link[0])
  console.log(link[0][i].__data__.source.index)  //accessing source index. other keyword is 'target'


  console.log(link)
  console.log(link[0].length)
  var i = 1
  //for (d in link[0])
  for (i = 0; i < link[0].length; i++) {

      linkedByIndex[link[0][i].__data__.source.index + "," + link[0][i].__data__.target.index] = 1;
  };
  console.log(linkedByIndex)
  //This function looks up whether a pair are neighbours
  function neighboring(a, b) {
      return linkedByIndex[a.index + "," + b.index];
  }
  console.log(linkedByIndex)
  function connectedNodes() {
      if (toggle == 0) {
          //Reduce the opacity of all but the neighbouring nodes
          d = d3.select(this).node().__data__;
          node.style("opacity", function (o) {
              return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
          });
          link.style("opacity", function (o) {
              return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
          });
          toggle = 1;
      } else {
          //Put them back to opacity=1
          node.style("opacity", 1);
          link.style("opacity", 1);
          toggle = 0;
      }
  }

});







/*

var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);
node.append("circle")
    .attr("r", 8)
    .style("fill", function (d) {
    return color(d.group);
})
node.append("text")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.name })
      .style("stroke", "gray");



//Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
force.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
        return d.source.y;
    })
        .attr("x2", function (d) {
        return d.target.x;
    })
        .attr("y2", function (d) {
        return d.target.y;
    });
    d3.selectAll("circle").attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
    d3.selectAll("text").attr("x", function (d) {
        return d.x;
    })
        .attr("y", function (d) {
        return d.y;
    });
});
*/




