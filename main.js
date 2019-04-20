/* TO DO's:
CTRL + F "TODO" AND FINISH
( ) the timeline axis needs a label
        (X) timeline axis ticks should NOT have commas
(X) try to make the category chart into a pie chart
(X) link the category chart to the timeline
( ) make 2nd chart
( ) also add a brush that if you highlight certain dots,
    it returns stats (right below the name, age... detail) such as:
    range of years highlighted, total # of prizes
    most common category in those years, etc
( ) fix position of the svg elements
(X) placeholder text for the pie chart in the center should say "categories"
 */

 //call to make the category chart
// categoryChart();
pieCategory();

//width0 and height0 are for the actual svg
var width0 = 1300;
var height0 = 800;

//width and height are for the graph to use itself.
//i could do margins? but nah
var width = 1250;
var height = 400;

var clicked;
//made the x
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([1895, 2018]);

//create the svg and append it, translated halfway down the screen
var chart0G = d3.select("#chart4")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")

//tooltip
const tooltip = d3.select("#body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const t = d3.transition()
    .duration(1000);

//data file
var dataFileName = "nobel_laureates.csv"

//number of bins for histogram
// 2018 - 1900 = 118/2 = 59
const nbins = 59;

//current bin, for setting the circle ids
var cbin;

//get data
d3.csv(dataFileName, function(error, allData) {
    //append what we need to the array allDate
    allData.forEach(function(d) {
        d.fullname = d.fullname
        d.year = +d.year
        d.category = d.category
        //d.year = d3.time.format("%Y-%m-%d").parse(d.year)
        //parseData(d.year);
        d.motivation = d.motivation;
        if (d.died == "0000-00-00") {
             d.died = "Present"
        }
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
                // born: datef(p.born),
                bornin: p.born_city + ", " + p.born_country,
                bornfrom: p.born + " -- " + p.died,
                categ: p.category,
                value: p.year,
                    rad: (x(d.x1)-x(d.x0))/4.5}
        }))

        //add the circles!!
        .enter()
        .append("circle")
        .attr("class", d => d.categ)
        .attr("id", function(d,i) {
            //id for circles is bin id + circle #
            cbin = d3.select(this.parentElement).attr("id").substring(3);
            return "b" + cbin + "c" + i;
        })
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", (d, i) => {
            return -1*(- i * 2.3 * d.rad - d.rad)})
        .attr("r", d => d.rad)
        .on("click", function(d){
            d3.select('#name')
            .text(d.name)
            d3.select('#age')
            .text(d.age)
            d3.select('#lived')
            .text(d.bornfrom)
            d3.select('#bornin')
            .text(d.bornin)
            d3.select('#motivation')
            .text(d.motiv)
            d3.select('#category')
            .text(d.categ)
        })
        .on("mouseover", tooltipon)
        .on('mouseout', tooltipoff);

        //add x axis on top
        //TODO add a label to the x axis
        chart0G.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 20 + ")")
            .call(d3.axisTop(x)
                .tickFormat(d3.format("d")));

});

//date formating TODO change the lived from YYYY-MM-DD TO Month Day, YYYY
function datef(d){
    // console.log(d);
    var origDate = d;
    var formatTime = d3.timeFormat("%Y-%m-%d");
    console.log(formatTime(origDate)); // "June 30, 2015"
    // var format = d3.time.format("%Y-%m-%d");
    // // convert the date string into a date object:
    // var date = format.parse(string);
    // // output the date object as a string based on the format:
    // console.log(format(date));
    //man, fuc dem stupid ass dates how tf does this work
    // // use the desired format
    // var format1 = d3.time.format("%B %d, %Y");
    // // output a date as a string in the desired format
    // console.log(format1(date));
}

//hover functionality
function tooltipon(d){
    let gParent = d3.select(this.parentElement)
    let translateValue = gParent.attr("transform")

    let gX = translateValue.split(",")[0].split("(")[1]
    let gY = height + (+d3.select(this).attr("cy")-5)

    d3.select(this)
        .classed("selected", true)

    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(d.name + "<br/> " + d.value + "" + "<br/> " + d.categ + "")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 35) + "px");
}

//hover functionality
function tooltipoff(d) {
    d3.select(this)
        .classed("selected", false)
        tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  }



function pieCategory(){
    var svg = d3.select("#chart1")
    .select("svg")
    ;
    var width0 = 400;
    var height0 = 400;
    var oRad = 70;
    var iRad = 60;
    var thick = 6;
    var text = "";
    var rad = 130;

    var chemP = 19.6;
    var litP = 12.9;
    var medP = 24.2;
    var peaP = 11.7;
    var physP = 23.1;
    var econP = 08.6;

    //COLORFIX
    var color = d3.scaleOrdinal()
        .range(["#f2db48", "#c97064", "#bca371", "#a6b07e", "#68a357", "#32965d"]);

    //TODO change the names so they're capitalized
    var dataSet = [
        {name: "chemistry", value: chemP},
        {name: "literature", value: litP},
        {name: "medicine", value: medP},
        {name: "peace", value: peaP},
        {name: "physics", value: physP},
        {name: "economics", value: econP}];

    var datum = [chemP, litP, medP, peaP, physP, econP];
    var colorSet = d3.map({"chemistry": "#f2db48", "literature": "#c97064",
            "medicine": "#bca371", "peace": "#a6b07e", "physics": "#68a357",
            "economics": "#32965d"});

    var svg = d3.select("#chart1")
        .append("svg:svg") //create the SVG element inside the <body>
        .attr("class", "pie")
        .attr("width", width0) //set the width of the canvas
        .attr("height", height0)
                ; //set the height of the canvas

    var g = svg.append('g')
        .attr('transform', 'translate(' + (width0/2) + ',' + (height0/2 ) + ')');
    var arc = d3.arc()
        .innerRadius(rad - thick)
        .outerRadius(oRad);

    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(dataSet))
        .enter()
        .append("g")
        .on("mouseover", function(d) {
              let g = d3.select(this)
                .append("g")
                .attr("class", "text-group"); //clears value each time

            g.append("text")
                .attr("class", "label")
                .text(`${d.data.name}`)
                .style('text-align', 'center')
                // .attr('text-anchor', 'right')
                .attr('dy', '1.0em')
                .attr('dx', '-2.0em')
                .style("font-family","Arial")
                .style("font-size","15px");

                // .style("font-size","25px");

            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}` + "%")
                .style("fill", colorSet.get(d.data.name))
                .style('text-align', 'center')
                .attr('dx', '-1.0em')
                .style("font-family","Arial")
                .style("font-size","20px");
                // .style("font-size","25px");


            })
        // .on("click", function(d){
        //     //selects all the circles in the category selected and highlights them
        //     // var currClass = d3.selectAll('.' + d.data.name).attr("class");
        //     // console.log(currClass);
        //     var col = d3.selectAll('.' + d.data.name).style("fill");
        //     var curr = (col == d3.rgb(211,211,211));
        //     d3.selectAll('.' + d.data.name).style("fill", colorSet.get(d.data.name));
        //     clicked = true;
        //     //todo: add a button that clears the chart
        //
        // })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", colorSet.get(d.data.name))
                .select(".text-group").remove();
            var c = d3.selectAll('.' + d.data.name);
            c.classed("hovered", false);
            })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => color(i))
        .on("mouseover", function(d) {
            d3.select(this)
                .style("cursor", "pointer")
                .classed("hovered", true);
                d3.selectAll('.' + d.data.name).style("fill", colorSet.get(d.data.name));
                //COLORFIX do we want the hover color to be black
                //.style("fill", "lightgrey");
            })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("cursor", "none")
                .classed("hovered", false)
                .classed("selected", false)
                if(!clicked){
                    d3.selectAll('.' + d.data.name).style("fill", "lightgrey");
                }

                // .classed("physics-selected", false);
                //.style("fill", color(this._current));
            })
        .each(function(d, i) { this._current = i; });

        g.append("text")
            //.attr("text-anchor", "center")
            .attr('dy', '-6em')
            .attr('dx', '-2em')
            .attr("id", "graphlabel")
            .text("Category")
            .style("font-family", "Arial")
            .style("font-weight", "bold")
            .style("font-size", "25px");

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(text);

    d3.csv("nobel_laureates.csv", function(error, data) {
        var allGroup = ["chemistry", "literature", "medicine", "peace", "physics", "economics"];

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
            })
        };
        });
        // I strongly advise to have a look to dataReady with
        // console.log(dataReady)
    })


}


function categoryChart(){
    // **** Your JavaScript code goes here ****
    var data_arr;
    //CHANGED: d3.select("#main") to d3.select("#chart1")
    var svg = d3.select("#chart1").select("svg");
    //w/h of actual svg so no overlap
    var width0 = 325;
    var height0 = 375;
    //w/h given to chart so it formats nicely :)
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
