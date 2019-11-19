import React, { Component } from 'react';
import './App.css'
import * as d3 from 'd3'

class Tree extends Component {
    constructor(props){
        super(props);
	this.state ={
	    data:props.data,
		/*{'name':'root', 'parent':''},
		{'name':'child', 'parent':'root'}*/
	    height: props.height,
	    width: props.width
	    
	};
	this.createGraph = this.createGraph.bind(this);
    }
    componentDidMount() {
	this.createGraph(this.state.data);
	
    }
    componentDidUpdate() {
       this.createGraph([]);
   }
    createGraph(rawData){
	//Check for actual array
	if(rawData && rawData.length){
	console.log(this.state.data);
	var raw_Data = this.state.data;
	console.log(raw_Data)// Array of Objects.
	var data = d3.stratify()
	    .id(function(d) { return d.name; })
	    .parentId(function(d) { return d.parent; })
	(raw_Data);
	var treeLayout = d3.tree()
	    .size([this.state.height - 100, this.state.width- 100])
	var root = d3.hierarchy(data)
	console.log(root);
	treeLayout(root);
	var tip = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);
	// Nodes
	d3.select('svg g.nodes')
	    .selectAll('circle.node')
	    .data(root.descendants())
	    .enter()
	    .append('circle')
	    .classed('node', true)
	    .attr('cx', function(d) {return d.x;})
	    .attr('cy', function(d) {return d.y;})
	    .attr('r', 6).on('mouseover', function(d){
		console.log(d.data.data.name);
		var data = d.data.data;
		var all_data = '';
		for (var key of Object.keys(data)) {
		    if(data[key])
			all_data += '<p>'+key+':'+data[key] + '<br>'+'</p>'
		}
		tip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
		return tip.html(all_data)
		    .style("top", (d3.event.pageY + 16) + "px")
		    .style("left", (d3.event.pageX + 16) + "px")
		    .style("display", "inline-block");	
	    })
	    .on('mouseout',function(){
		tip.transition()		
                    .duration(200)	.style('opacity',0)
	    });

	// Links
	d3.select('svg g.links')
	    .selectAll('line.link')
	    .data(root.links())
	    .enter()
	    .append('line')
	    .classed('link', true)
	    .attr('x1', function(d) {return d.source.x;})
	    .attr('y1', function(d) {return d.source.y;})
		.attr('x2', function(d) {return d.target.x;})
		.attr('y2', function(d) {return d.target.y;});
	}
    }
    render() {
	return (<div>
		<svg width={this.state.width} height={this.state.height}>
    <g transform="translate(10, 10)">
		<g className="links"></g>
      <g className="nodes"></g>
    </g>
  </svg>
	</div>);
    }
}

export default Tree;
