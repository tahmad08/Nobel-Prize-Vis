
// **** Your JavaScript code goes here ****
var data_arr;
var svg = d3.select("#main").select("svg");
var width = 760;
var height = 600;
d3.csv("nobel_laureates.csv", function(dataset){
  data_arr = dataset;
  categoryPlot(data_arr);
  //plot2(data_arr);
  //plot1(data_arr);


});

function categoryPlot(data_arr) {

    //setting up chart container
    var chart1G = d3.select("#chart1")
    	                .append("svg:svg")
    	                .attr("width",width)
    	                .attr("height",height)
                        .append('g');

    //rollup of nobel categories
    var category = d3.nest()
        .key(function (d) {return d.category;})
        .rollup(function(v) { return v.length; })
        .entries(data_arr)
        console.log(JSON.stringify(category)); //prints the arrays with values

    //setting up axies of the chart
    var x = d3.scaleBand()
        .domain(category.map(function (d) { return d.key }))
        .range([0, width/2 - 100])


    var extent = d3.extent(category, function(d) {return d.value})


    var y = d3.scaleLinear()
        .domain([0, extent[1] + 10])
        .range([height, 300])
    //setting up the colors
    function colorPicker(cat) {
        if (cat == "chemistry") {
            return "#f2db48" //minion yellow
        } else if (cat == "literature") {
            return "#c97064" //red
        } else if (cat == "medicine") {
            return "#bca371" //wood brown
        } else if (cat == "peace") {
            return "#a6b07e" //sand (sage)
        } else if (cat == "physics") {
            return "#68a357" //russian green
        } else if (cat == "economics") {
            return "#32965d"  //sea green
        }
        return "#ffffff";
    }


    //drawing the bars
    chart1G.selectAll()
        .data(category)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.key) + 50})
        .attr("y", function(d) {return y(d.value) - 50})
        .attr("width", 20)
        .attr("height", function (d) { return height - y(d.value) })
        //coloring the bar
        .attr("fill", function (d) {return colorPicker(d.key) } )


    chart1G.append('g').attr('class', 'xaxis')
            .attr("transform", "translate (40, 560)")
            .call(d3.axisBottom(x))

    chart1G.append('g').attr('class', 'y axis')
            .attr("transform", "translate (40,-50)")
            .call(d3.axisLeft(y))
}

//TODO build the timeline and link it to category (probably need lots of TA help for this)
//TODO set up the age ranges and then make a plot
