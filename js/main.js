var all_data;
var all, nn_only;
// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    // This will load the dataset and store it into an array.
   Promise.all([d3.csv('data/wrangled_data.csv')])
   .then(function (values) {
       console.log('Loaded wrangled_data.csv');
       all_data = values[0];

       let homew = 0
       let awayw = 0
       let homew_nn = 0
       let awayw_nn = 0
       all_data.forEach(d => {
            if (d["won_by"] == "home") {
                homew += 1
                if (d.neutral == "FALSE") {
                    homew_nn += 1
                }
            }
            else if (d["won_by"] == "away") {
                awayw += 1
                if (d.neutral == "FALSE") {
                    awayw_nn += 1
                }
            }
       });

       console.log(all_data)
       console.log(homew, awayw, homew_nn, awayw_nn)

       all = [
            { key: 'Home Wins', value: homew }, 
            { key: 'Away Wins', value: awayw },
       ];
       nn_only = [
            { key: 'Home Wins*', value: homew_nn }, 
            { key: 'Away Wins*', value: awayw_nn },
        ];
       drawDonutChart_for();
       drawDonutChart_against();
       
   });
});

function drawDonutChart_for() {
    const svg = d3.select('#against_svg');
    const width = +svg.style('width').replace('px','');
    //console.log("Width = ", width);
    const height = +svg.style('height').replace('px','');
    //console.log("Height = ", height);
    
    

    // 3. margin is used for adding "padding" around the bar chart
    const margin = { top: 40, bottom: 40, right: 20, left: 20 };
    
    var radius = Math.min(width - Math.max(margin.left, margin.right), height - Math.max(margin.top, margin.bottom)) / 2;

    color = d3.scaleOrdinal(d3.schemeSet1);
    
    const g = svg.append('g')
                .attr('transform', `translate(${ width / 2},${ height / 2})`);
                // .attr('transform', 'translate('+margin.left+', '+margin.top+')');
    
    var arc = d3.arc()
        .innerRadius(radius - (radius/3))             // NEW
        .outerRadius(radius);
    
    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(all))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
            return color(d.data.key);
        })
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .on('mouseover', function (d, i) {
            d3.select(this)
                 .style("stroke-width", "4px")
            g.select('text').remove();
            g.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("style","font-family:Arial")
                .attr("font-size","24")
                .attr("fill","#000000")
                .text(i.data.key + ": " + i.value);
                })
        .on('mouseout', function (d, i) {
            d3.select(this)
                    .style("stroke-width", "1px");
            g.select('text').remove();
                })
        .on('click', function (d, i) {drawBarChart(i.data.key)});
    
    console.log('trace:drawDonutChart()');
    }

function drawDonutChart_against() {
    const svg = d3.select('#for_svg');
    const width = +svg.style('width').replace('px','');
    //console.log("Width = ", width);
    const height = +svg.style('height').replace('px','');
    //console.log("Height = ", height);
    
    

    // 3. margin is used for adding "padding" around the bar chart
    const margin = { top: 40, bottom: 40, right: 20, left: 20 };
    
    var radius = Math.min(width - Math.max(margin.left, margin.right), height - Math.max(margin.top, margin.bottom)) / 2;

    color = d3.scaleOrdinal(d3.schemeSet1);
    
    const g = svg.append('g')
                .attr('transform', `translate(${ width / 2},${ height / 2})`);
                // .attr('transform', 'translate('+margin.left+', '+margin.top+')');
    
    var arc = d3.arc()
        .innerRadius(radius - (radius/3))             // NEW
        .outerRadius(radius);
    
    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(nn_only))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
            return color(d.data.key);
        })
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .on('mouseover', function (d, i) {
            d3.select(this)
                    .style("stroke-width", "4px")
            g.select('text').remove();
            g.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("style","font-family:Arial")
                .attr("font-size","24")
                .attr("fill","#000000")
                .text(i.data.key + ": " + i.value);
                })
        .on('mouseout', function (d, i) {
            d3.select(this)
                    .style("stroke-width", "1px");
            g.select('text').remove();
                })
        .on('click', function (d, i) {drawBarChart(i.data.key)});
    
    console.log('trace:drawDonutChart()');
    }