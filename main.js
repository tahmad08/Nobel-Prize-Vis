//width0 and height0 are for the actual svg
var width0 = 1300;
var height0 = 1100;

//width and height are for the graph to use itself. 
//i could do margins? but nah
var width = 1200;
var height = 400;
//made the x 
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([1895, 2018]);

var chart0G = d3.select("#chart0")
    .append("svg:svg")
    .attr("width", width0)
    .attr("height", height0)
    .append("g")
    .attr("transform",
                `translate(50,350)`);

var t = d3.transition()
    .duration(1000);

var shift = 1;
var dataFile = "nobel_laureates.csv"

//number of bins for histogram
const nbins = 59;

    //get data (?)
    d3.csv(dataFile, function(error, allData) {
        allData.forEach(function(d) {
            d.fullname = d.fullname
            d.year = +d.year;
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
        .data(bins)
        .enter()
        .append("g" )
        .attr("class", "gBin")
        .attr("transform", d => `translate(${x(d.x0)}, ${20})`)
        .selectAll("circle")
        .data(d => d.map((p, i) => {
            return {value: p.year,
                    radius: (x(d.x1)-x(d.x0))/4.5}
        }))
        .enter()
        .append("circle")
        .attr("class", "enter")
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", (d, i) => {
            return -1*(- i * 2.3 * d.radius - d.radius)})
        .attr("r", d => d.radius);
        // add x axis
        chart0G.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 20 + ")")
            .call(d3.axisTop(x));

    });

