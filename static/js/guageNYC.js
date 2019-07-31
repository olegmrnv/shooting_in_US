// Enter a speed between 0 and 180
var level = 3.17;
var level_adjusted = level * 1.8;

// Trig to calc meter point
var degrees = 180 - level_adjusted,
    radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
var path = mainPath.concat(pathX, space, pathY, pathEnd);

var data = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { size: 28, color: '850000' },
        showlegend: false,
        name: 'crime level',
        text: level,
        hoverinfo: 'text+name'
    },
    {
        values: [40 / 5, 40 / 5, 40 / 5, 40 / 5, 40 / 5, 40],
        rotation: 90,
        text: ['Extreme', 'Very High', 'High', 'Average',
            'Low', ''
        ],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['rgba(153,52,4, .5)', 'rgba(217,95,14, .5)',
                'rgba(254,153,41, .5)', 'rgba(254,217,142, .5)',
                'rgba(255,255,212, .5)', 'rgba(255, 255, 255, .1)'
            ]
        },
        labels: ['80-100', '60-80', '40-60', '20-40', '0-20', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }
];

var layout = {
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
    }],
    title: '<b>New York City</b> <br> Crime level 0-100',
    height: 600,
    width: 600,
    xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
    },
    yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
    }
};

Plotly.newPlot('NYCDiv', data, layout);