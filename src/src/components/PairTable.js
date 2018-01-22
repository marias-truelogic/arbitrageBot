import React, { Component } from 'react';

const LineChart = require("react-chartjs").Line;

class PairTable extends Component {

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
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
                {
                    label: "Test",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "Test 2",
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

export default PairTable;
