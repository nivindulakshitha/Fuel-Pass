import React from "react";
import './formLabel.css'

export default class Label extends React.Component {
    render() {
        return (
            <p className="h5 label" require={this.props.require}>{this.props.value}</p>
        )
    }
}