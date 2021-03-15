import React from 'react';
import Lines from "./components/Lines";
import {Map, List} from 'immutable';
import html2canvas from 'html2canvas';

class Paint extends React.Component {

    constructor() {
        super();
        this.paintZone = React.createRef();
        this.state = {
            lines: new List(),
            isPainting: false
        };

        this.screenshot = this.screenshot.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    screenshot() {
        html2canvas(document.querySelector("#paint"), {
            useCORS: true
        }).then(canvas => {
            console.log(canvas.toDataURL())
            document.body.appendChild(canvas)
        });
    }

    handleMouseUp() {
        this.setState({ isPainting: false });
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0) {
            return;
        }

        const point = this.pointCoordinates(mouseEvent);

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            isPainting: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isPainting) {
            return;
        }

        const point = this.pointCoordinates(mouseEvent);

        this.setState(prevState => ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
        }));
    }

    pointCoordinates(mouseEvent) {
        const boundingRect = this.paintZone.current.getBoundingClientRect();
        return new Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
    }

    render() {
        return (
            <div
                id="paint"
                className="paintZone"
                ref={this.paintZone}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >
                <Lines lines={this.state.lines} />
                <button className="button" onClick={this.screenshot}>Screenshot</button>
            </div>
        );
    }


}

export default Paint;
