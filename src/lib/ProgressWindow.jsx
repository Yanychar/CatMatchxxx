import React, {Component} from 'react';

import './progressWindowStyle.scss';


export default class ProgressWindow extends Component {
    render() {
        const p = this.props;
        const s = this.state;
        return (
            <div className="progress-balls-outher progress-window">
                <div className="p-b-icon">
                    <div className="wBall" id="wBall_1">
                        <div className="wInnerBall"/>
                    </div>
                    <div className="wBall" id="wBall_2">
                        <div className="wInnerBall"/>
                    </div>
                    <div className="wBall" id="wBall_3">
                        <div className="wInnerBall"/>
                    </div>
                    <div className="wBall" id="wBall_4">
                        <div className="wInnerBall"/>
                    </div>
                    <div className="wBall" id="wBall_5">
                        <div className="wInnerBall"/>
                    </div>
                </div>
            </div>
        )
    }
}
