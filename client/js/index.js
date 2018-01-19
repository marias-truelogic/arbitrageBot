import React from "react";
import ReactDOM from "react-dom";
import axios from "axios":

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


// import UserTable from './components/UserTable';
// import UserForm from './components/UserForm';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentWillMount() {
        this.getData();
    }

    render() {
        const { users, contract, accounts, web3 } = this.state;

        return (
            <div className="container-fluid">
                <div className='row'>
                    <div className="col">
                        <h2>WIP</h2>
                    </div>
                </div>
            </div>
        );
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render(< Main />, mountNode);