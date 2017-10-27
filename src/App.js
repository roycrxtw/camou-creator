import React, { Component } from 'react';

import colorData from './colorData';
import './App.css';

const data = [];
const DEFAULT_CANVAS_SIZE = 300;
const DEFAULT_DENSITY = 50;
const CANVAS_SIZE_MAX = 4000;
const CANVAS_SIZE_MIN = 100;

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedColor: 0,
      density: DEFAULT_DENSITY,
      canvasSize: DEFAULT_CANVAS_SIZE,
      focus: null
    };
  }
  componentDidMount(){
    this.draw();
  }

  componentDidUpdate(){
    this.draw();
  }

  draw = () => {
    console.log('App.draw() started.')
    const { canvasSize, density, selectedColor } = this.state;

    const tileSize = Math.ceil(canvasSize / density);
    const rows = Math.ceil(canvasSize / tileSize);
    const columns = Math.ceil(canvasSize / tileSize)
    const ctx = this.refs.canvas.getContext('2d');

    for(let x = 0; x < columns; x++){
      data[x] = [];
      
      for(let y = 0; y < rows; y++){
        let p = Math.floor(Math.random() * 100);
        if(p < 0){
          data[x][y] = 'rgb(60, 80, 60)';
        }else{
          let leftTileColor;
          let topTileColor;
          let numberOfChoice = 4;
          if(x > 0){
            leftTileColor = data[x - 1][y];
            numberOfChoice++;
          }
          if(y > 0){
            topTileColor = data[x][y - 1];
            numberOfChoice++;
          }
          switch(Math.floor(Math.random() * numberOfChoice)){
            case 0: 
              data[x][y] = colorData[selectedColor].color[0]; break;
            case 1:
              data[x][y] = colorData[selectedColor].color[1]; break;
            case 2:
              data[x][y] = colorData[selectedColor].color[2]; break;
            case 3:
              data[x][y] = colorData[selectedColor].color[3]; break;
            case 4:
              data[x][y] = topTileColor; break;
            case 5:
              data[x][y] = leftTileColor; break;
            default:
              data[x][y] = colorData[selectedColor].color[0]; break;
          }
          //ctx.fillStyle = (x % 2 === 0)? '#222': 'wheat';
          //ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }

    for(let x = 0; x < columns; x++){
      for(let y = 0; y < rows; y++){
        ctx.fillStyle = data[x][y];
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  };

  setCanvasSize = (event) => {
    let value = event.target.value;
    if(value > CANVAS_SIZE_MAX){
      value = CANVAS_SIZE_MAX;
    }
    this.setState({
      canvasSize: value
    });
  };

  setDensity = (event) => {
    this.setState({
      density: event.target.value
    });
  };

  sizeFieldWheelHandler = event => {
    event.preventDefault();
    const current = this.state.canvasSize;
    if(event.deltaY > 0){
      this.setState({
        canvasSize: (current < CANVAS_SIZE_MAX)? current + 20: CANVAS_SIZE_MAX
      });
    }else if(event.deltaY < 0){
      this.setState({
        canvasSize: (current > CANVAS_SIZE_MIN)? current - 20: CANVAS_SIZE_MIN
      });
    }
  };

  densityFieldWheelHandler = event => {
    event.preventDefault();
    const current = this.state.density;
    if(event.deltaY > 0){
      this.setState({
        density: current + 1
      });
    }else if(event.deltaY < 0){
      this.setState({
        density: current - 1
      });
    }
  };

  reset = () => {
    this.setState({
      canvasSize: DEFAULT_CANVAS_SIZE,
      density: DEFAULT_DENSITY
    });
  };

  setColor = (event) => {
    this.setState({
      selectedColor: event.target.value
    });
  };

  menu = (props) => {
    const getList = () => {
      const listItems = colorData.map( (item, i) => (
        <option key={i} value={i}>{item.name}</option>
      ));

      return (
        <select className='color-list' onChange={this.setColor}>{listItems}</select>
      );
    }

    const { canvasSize, density } = this.state;
    return (
      <div className='menus'>
        <div className='menu'>
          <label htmlFor='sizeField'>
            Image size in px
            <input type='text' id='sizeField' value={canvasSize} 
              //onChange={this.setCanvasWidth} onWheel={e => this.widthFieldWheelHandler(e)}
              onChange={this.setCanvasSize} 
              onWheel={this.sizeFieldWheelHandler}
            />
          </label>
          <label htmlFor='densityField'>
            Camouflage density
            <input type='text' id='densityField' value={density} 
              onChange={this.setDensity} onWheel={this.densityFieldWheelHandler}
            />
          </label>
        </div>

        <div className='menu'>
          {getList()}
          <button className='btn-reset' onClick={this.reset}>RESET</button>
        </div>
      </div>
    );
  };

  render() {
    const { canvasSize } = this.state;
    return (
      <div className="App">
        <header className="app-header">
          <h1 className="app-title">CamouCreator</h1>
          {this.menu()}
        </header>

        <p>Current image size is {canvasSize} x {canvasSize}. Right click on the image to save it.</p>

        <canvas ref='canvas' id='main-canvas' title='Save me' width={canvasSize} height={canvasSize}>
        </canvas>
        
        <footer>
          Project camouCreator by Roy Lu(royvbtw) Oct, 2017
        </footer>
      </div>
    );
  }
}

export default App;
