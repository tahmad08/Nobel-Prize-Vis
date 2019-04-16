//width0 and height0 are for the actual svg
var width0 = 1300;
var height0 = 800;

//width and height are for the graph to use itself. 
//i could do margins? but nah
var width = 1250;
var height = 400;


//made the x 
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([1895, 2018]);

//create the svg and append it, translated halfway down the screen
var chart0G = d3.select("#chart0")
    .append("svg:svg")
    .attr("width", width0)
    .attr("height", height0)
    .append("g")
    .attr("transform",
                `translate(50,400)`);

//tooltip
const tooltip = d3.select("#chart0")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
const t = d3.transition()
    .duration(1000);

//data file
var dataFile = "nobel_laureates.csv"

//number of bins for histogram
// 2018 - 1900 = 118/2 = 59
const nbins = 59;

//current bin, for setting the circle ids
var cbin;

//get data
d3.csv(dataFile, function(error, allData) {
    //append what we need to the array allDate
    allData.forEach(function(d) {
        d.fullname = d.fullname
        d.year = +d.year
        d.motivation = d.motivation;
    });
    //histogram binning
    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(nbins))
        .value(d => +d.year);

    //binning data and filtering out empty bins
    const bins = histogram(allData);
        console.log(bins)

    //g container for each bin
    let binContainer = chart0G.selectAll("g.gBin")
        //bin shit, tbh idk what this does
        .data(bins)
        .enter()
        .append("g" )
        .attr("class", "gBin")
        .attr("id", function(d,i) {cbin = i; return "bin" + i;} )
        .attr("transform", d => `translate(${x(d.x0)}, ${20})`)
        .selectAll("circle")
        .data(d => d.map((p, i) => {
            return {
                name: p.fullname,
                motiv: p.motivation,
                age: p.age,
                bornin: p.born_city + ", " + p.born_country,
                categ: p.category,
                value: p.year,
                    radius: (x(d.x1)-x(d.x0))/4.5}
        }))
        //add the circles!!
        .enter()
        .append("circle")
        .attr("class", "enter")
        .attr("id", function(d,i) {
            //id for circles is bin id + circle #
            cbin = d3.select(this.parentElement).attr("id").substring(3);
            return "b" + cbin + "c" + i;
        } )
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", (d, i) => {
            return -1*(- i * 2.3 * d.radius - d.radius)})
        .attr("r", d => d.radius)
        .on("click", function(d){
            document.querySelector('#nameO').value = d.name;
			document.querySelector('#ageO').value = d.age;
			document.querySelector('#borninO').value = d.bornin;
			document.querySelector('#motivationO').value = d.motiv;
			document.querySelector('#categoryO').value = d.categ;
        })
        .on("mouseover", tooltipon)
        .on('mouseout', tooltipoff);
        //add x axis on top
        chart0G.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 20 + ")")
            .call(d3.axisTop(x));


});
categoryChart();
chart0G.call(tooltip);
//hover functionality
function tooltipon(d){
    let gParent = d3.select(this.parentElement)
    let translateValue = gParent.attr("transform")
  
    let gX = translateValue.split(",")[0].split("(")[1]
    let gY = height + (+d3.select(this).attr("cy")-5)

    d3.select(this)
        .classed("selected", true)
        .style("fill", "purple");
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(d.name + "<br/> (" + d.value + ")")
        .style("left", d3.event.pageX + "px")
        .style("top", (d3.event.pageY - 35) + "px");
}

//hover functionality
function tooltipoff(d) {
    d3.select(this)
        .classed("selected", false)
        .style("fill", "lightblue");
      tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  }//tooltipOff

  
function categoryChart(){
    // **** Your JavaScript code goes here ****
    var data_arr;
    var svg = d3.select("#main").select("svg");
    var width0 = 325;
    var height0 = 375;
    var width = 760;
    var height = 600;
    d3.csv("nobel_laureates.csv", function(dataset){
        data_arr = dataset;
        categoryPlot(data_arr);

    });

    function categoryPlot(data_arr) {

        //setting up chart container
        var chart1G = d3.select("#chart1")
                            .append("svg:svg")
                            .attr("width",width0)
                            .attr("height",height0)
                            .append('g');

        //rollup of nobel categories
        var category = d3.nest()
            .key(function (d) {return d.category;})
            .rollup(function(v) { return v.length; })
            .entries(data_arr)
            console.log(JSON.stringify(category)); //prints the arrays with values

        //setting up axes of the chart
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
            .attr("y", function(d) {return y(d.value) - 275})
            .attr("width", 20)
            .attr("height", function (d) { return height - y(d.value) })
            //coloring the bar
            .attr("fill", function (d) {return colorPicker(d.key) } )
        chart1G.append('g').attr('class', 'xaxis')
                .attr("transform", "translate (40, 325)")
                .call(d3.axisBottom(x))

        chart1G.append('g').attr('class', 'y axis')
                .attr("transform", "translate (40, -275)")
                .call(d3.axisLeft(y))


        //setting up axes of the chart
        var x0 = d3.scaleBand()
            .domain(category.map(function (d) { return d.key }))
            .range([0, width/2 - 100])


        var extent0 = d3.extent(category, function(d) {return d.value})

        var y0 = d3.scaleLinear()
            .domain([0, extent0[1] + 10])
            .range([height, 300])


}}