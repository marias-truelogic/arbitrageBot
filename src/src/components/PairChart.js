import React, { Component } from 'react';

const LineChart = require("react-chartjs").Line;


class PairChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pairs: [],
            chartData: [1,5,7,12,45,67,102,223],
            isLoaded: true
        }
    }

    render() {
        const { isLoaded, chartData } = this.state;


        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        return (
            <div>
                { isLoaded ? <LineChart data={data} width="600" height="250" /> : ''}
            </div>
        );
    }
}

export default PairChart;
