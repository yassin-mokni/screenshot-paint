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
            isPainting: false,
        };

        this.screenshot = this.screenshot.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);

        const zone = document.getElementById('paint');
        const image = document.getElementById('image');
        image.crossOrigin = "Anonymous";
        zone.addEventListener('mousemove',function(e) {
            if(!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = image.width;
                this.canvas.height = image.height;
                this.canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            }
            var pixelData = this.canvas.getContext('2d').getImageData(e.offsetX, e.offsetY, 1, 1).data;
            if(pixelData[0]==0&&pixelData[1]==0&&pixelData[2]==0&&pixelData[3]==255) {
                this.setState({ isPainting: false });
            }
        }.bind(this));
    

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
            document.getElementById("hint").style.display="block";
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
                <p id="hint" style={{"display":"none"}} >Check the console to get the base64 encoded data URL</p>
                <img id="image" src="https://yassine-mokni.github.io/screenshot-paint/mug.png" style={{"visibility":"hidden"}}/>
            </div>
        );
    }


}

export default Paint;
