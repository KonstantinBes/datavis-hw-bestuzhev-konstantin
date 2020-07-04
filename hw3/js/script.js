const b_width = 1000;
const d_width = 500;
const b_height = 1000;
const d_height = 1000;
const colors = [
    '#DB202C','#a6cee3','#1f78b4',
    '#33a02c','#fb9a99','#b2df8a',
    '#fdbf6f','#ff7f00','#cab2d6',
    '#6a3d9a','#ffff99','#b15928']

// Part 1: Создать шкалы для цвета, радиуса и позиции 
const radius = d3.scaleLinear().range([.5, 20]);
const color = d3.scaleOrdinal().range(colors);
const x = d3.scaleLinear().range([0, b_width]);

var bubble = d3.select('.bubble-chart')
    .attr('width', b_width).attr('height', b_height);

var donut = d3.select('.donut-chart')
    .append("svg")
      .attr("width", d_width)
      .attr("height", d_height)
    .append("g")
      .attr("transform", "translate(" + d_width / 2 + "," + d_height / 2 + ")");

const donut_lable = d3.select('.donut-chart').append('text')
        .attr('class', 'donut-lable')
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${(d_width/2)} ${d_height/2})`);

const tooltip = d3.select('.tooltip');

//  Part 1 - Создать симуляцию с использованием forceCenter(), forceX() и forceCollide()




d3.csv('data/netflix.csv').then(data=>{
    data = d3.nest().key(d=>d.title).rollup(d=>d[0]).entries(data).map(d=>d.value).filter(d=>d['user rating score']!=='NA');
    console.log(data)
    
    const rating = data.map(d=>+d['user rating score']);
    const years = data.map(d=>+d['release year']);
    let ratings = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    
    
    // Part 1 - задать domain  для шкал цвета, радиуса и положения по x
    const rScale = d3.scaleLinear().range([1, 15]).domain([d3.min(rating), d3.max(rating)])
    const xScale = d3.scaleLinear().range([0, b_width]).domain([d3.min(years), d3.max(years)])
    const colorScale = d3.scaleOrdinal().range(colors).domain(ratings)

    // Part 1 - создать circles на основе data
    var nodes = bubble
        .selectAll("circle")
        .data(data).enter()
        .append('circle')
        .attr("class", "nodes")
        .attr('r', d => rScale(+d['user rating score']))
        .attr('fill', d => colorScale(d['rating']))

    // добавляем обработчики событий mouseover и mouseout
            // .on('mouseover', overBubble)
            // .on('mouseout', outOfBubble);

    
    // Part 1 - передать данные в симуляцию и добавить обработчик события tick

    
    d3.forceSimulation()
    .nodes(data)
    .force("center", d3.forceCenter(b_width / 2, b_height / 2))
    .force('x', d3.forceX(d => xScale(+d['release year'])))
    .force('collide', d3.forceCollide().radius(d => rScale(+d['user rating score'])))
    .on("tick", ticked);

    function ticked() {
    nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }

    // Part 1 - Создать шаблон при помощи d3.pie() на основе ratings
    var pie = d3.pie()
        .value(function(d) {return d.value})
        .padAngle(0.02);

    var data_ready = pie(ratings)

    // Part 1 - построить donut chart внутри donut
    donut
        .selectAll('arc')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(d_width / 3)
            .outerRadius(d_width / 2)
            .cornerRadius(10))
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', d => colorScale(d.data.key))

    // добавляем обработчики событий mouseover и mouseout
        //.on('mouseover', overArc)
        //.on('mouseout', outOfArc);

    function overBubble(d){
        console.log(d)
        // Part 2 - задать stroke и stroke-width для выделяемого элемента   
        // ..
        
        // Part 3 - обновить содержимое tooltip с использованием классов title и year
        // ..

        // Part 3 - изменить display и позицию tooltip
        // ..
    }
    function outOfBubble(){
        // Part 2 - сбросить stroke и stroke-width
        // ..
            
        // Part 3 - изменить display у tooltip
        // ..
    }

    function overArc(d){
        console.log(d)
        // Part 2 - изменить содержимое donut_lable
        // ..
        // Part 2 - изменить opacity арки
        // ..

        // Part 3 - изменить opacity, stroke и stroke-width для circles в зависимости от rating
        // ..
    }
    function outOfArc(){
        // Part 2 - изменить содержимое donut_lable
        // ..
        // Part 2 - изменить opacity арки
        // ..

        // Part 3 - вернуть opacity, stroke и stroke-width для circles
        // ..
    }
});