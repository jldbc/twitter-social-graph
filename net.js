var w = 1050,
    h = 1050,
    fill = d3.scale.category20();

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json("data.json", function(json) {
  var force = d3.layout.force()
      .charge(-700)
      .linkDistance(60)
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

  var node = vis.selectAll("g.node")
      .data(json.nodes)
    .enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("svg:circle")
    .attr("r", 3.5)
    //.style("fill", "#234B6F") 
    .style("fill", function (d) { return '#d62728'; })
    .call(force.drag)
    .on('dblclick', connectedNodes);
      
  node.append("svg:text")
    .data(json.nodes)
    .style("pointer-events", "none")
    .text(function(d) { return d.id;})
    .attr("fill", "#555") 
    .attr("font-size", "11px") 
    .attr("dx", "8") 
    .attr("dy", ".35em");

  node.append("svg:title") 
      .style("pointer-events", "none") 
      .text(function(d) { return d.id;})

console.log(node[0][33].id)

  vis.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; 
        node[0].x = w/2;  
        node[0].y = h/2;});

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr('id', function(d) {return d.id})
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); ;

    //label.attr("cx", function)

  });

  console.log(node[0][56])




  //Toggle stores whether the highlighting is on
  var toggle = 0;
  //Create an array logging what is connected to what
  var linkedByIndex = {};
  for (i = 0; i < node[0].length; i++) {
      linkedByIndex[i + "," + i] = 1;
  };

  console.log(link[0])
  console.log(link[0][i].__data__.source.index)  //accessing source index. other keyword is 'target'

  var i = 1
  //for (d in link[0])
  for (i = 0; i < link[0].length; i++) {

      linkedByIndex[link[0][i].__data__.source.index + "," + link[0][i].__data__.target.index] = 1;
  };


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
      }

      else {
          node.style("opacity", 1);
          link.style("opacity", 1);
          toggle = 0;
      }
  }

});

