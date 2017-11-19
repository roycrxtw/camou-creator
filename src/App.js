import React, { Component } from 'react';

import colorData from './colorData';
import { parseHexToRGB, getRGBString } from './util';
import './App.css';

const data = [];    // colour data
const DEFAULT_CANVAS_SIZE = 300;
const DEFAULT_DENSITY = 50;
const CANVAS_SIZE_MAX = 4000;
const CANVAS_SIZE_MIN = 100;
const DENSITY_MIN = 10;

// ColorPickers component.
const ColorPickers = (props) => {
  const {changeHandler, currentColor} = props;
  const pickers = [];
  for(let i = 0; i < 4; i++){
    pickers.push(
      <label className='colorLabel' key={i}>
        {getRGBString(parseHexToRGB(currentColor[i]))}
        <input type='color' className='colorPicker'
          value={currentColor[i]} onChange={e => {changeHandler(e, i)}}
        />
      </label>
    );
  }
  return (<div className='colorPickerContainer'>{pickers}</div>);
};


class App extends Component {
  constructor(props){
    super(props);
    
    this.canvas = null;

    this.state = {
      selectedColor: 0,
      currentColor: colorData[0].color,
      density: DEFAULT_DENSITY,
      canvasSize: DEFAULT_CANVAS_SIZE
    };
  }
  componentDidMount(){
    this.drawCanvas();
  }

  componentDidUpdate(){
    this.drawCanvas();
  }

  drawCanvas = () => {
    const { canvasSize, density, currentColor } = this.state;

    const tileSize = Math.ceil(canvasSize / density);
    const rows = Math.ceil(canvasSize / tileSize);
    const columns = Math.ceil(canvasSize / tileSize)
    
    // Setup color data
    for(let x = 0; x < columns; x++){
      data[x] = [];
      
      for(let y = 0; y < rows; y++){
        let leftTileColor;
        let topTileColor;
        if(x > 0){
          leftTileColor = data[x - 1][y];
        }
        if(y > 0){
          topTileColor = data[x][y - 1];
        }
        let p = Math.random() * 100;
        if(p < 10) data[x][y] = currentColor[0];
        else if(p < 20) data[x][y] = currentColor[1];
        else if(p < 30) data[x][y] = currentColor[2];
        else if(p < 40) data[x][y] = currentColor[3];
        else if(p < 70) data[x][y] = topTileColor;
        else data[x][y] = leftTileColor;
      }
    }

    // Draw canvas by color data.
    const ctx = this.canvas.getContext('2d');
    for(let x = 0; x < columns; x++){
      for(let y = 0; y < rows; y++){
        ctx.fillStyle = data[x][y];
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  };

  setCanvasSize = (event) => {
    let value = event.target.value;
    let tooltips = undefined;
    if(value > CANVAS_SIZE_MAX){
      value = CANVAS_SIZE_MAX;
      tooltips = 'Max canvas size is ' + CANVAS_SIZE_MAX;
    }
    this.setState({
      tooltips,
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
        canvasSize: (current < CANVAS_SIZE_MAX)? current + 20: CANVAS_SIZE_MAX,
        tooltips: undefined
      });
    }else if(event.deltaY < 0){
      this.setState({
        canvasSize: (current > CANVAS_SIZE_MIN)? current - 20: CANVAS_SIZE_MIN,
        tooltips: undefined
      });
    }
  };

  densityFieldWheelHandler = event => {
    event.preventDefault();
    const current = this.state.density;
    if(event.deltaY > 0){
      this.setState({
        density: current + 1,
        tooltips: undefined
      });
    }else if(event.deltaY < 0){
      if(current <= DENSITY_MIN){
        this.setState({
          tooltips: 'The min density is ' + DENSITY_MIN,
          density: DENSITY_MIN
        });
      }else{
        this.setState({
          density: current - 1,
          tooltips: undefined
        });
      }
    }
  };

  reset = () => {
    this.setState({
      canvasSize: DEFAULT_CANVAS_SIZE,
      density: DEFAULT_DENSITY,
      currentColor: colorData[this.state.selectedColor].color
    });
  };

  listHandler = (event) => {
    const newColor = colorData[event.target.value].color;
    this.setState({
      selectedColor: event.target.value,
      currentColor: newColor
    });
  };

  pickerHandler = (event, i) => {
    const newColor = [...this.state.currentColor];
    newColor[i] = event.target.value
    this.setState({
      currentColor: newColor
    });
  };


  menu = (props) => {
    const getList = () => {
      const listItems = colorData.map( (item, i) => (
        <option key={i} value={i}>{item.name}</option>
      ));

      return (
        <select className='color-list' onChange={this.listHandler}>{listItems}</select>
      );
    }    

    const { canvasSize, density, currentColor } = this.state;
    return (
      <div className='menus'>
        <div className='menu'>
          {getList()}
          <label htmlFor='sizeField'>
            Image size in px
            <input type='text' id='sizeField' value={canvasSize} title='Set image size'
              onChange={this.setCanvasSize} 
              onWheel={this.sizeFieldWheelHandler}
            />
          </label>
          <label htmlFor='densityField'>
            Camouflage density
            <input type='text' id='densityField' value={density} title='Set density'
              onChange={this.setDensity} onWheel={this.densityFieldWheelHandler}
            />
          </label>
          
          <span style={{color: 'grey'}}>You can use the mouse wheel to adjust setting values.</span>
          <div className='tooltips'>{this.state.tooltips}</div>
        </div>

        <div className='menu'>
          
          <ColorPickers currentColor={currentColor} changeHandler={this.pickerHandler} />
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

        <canvas ref={ node => this.canvas = node} id='main-canvas' title='Save me' width={canvasSize} height={canvasSize}>
          Please enable javascript and/or update to modern browser.
        </canvas>
        
        <footer>
          <a href='https://github.com/royvbtw/camou-creator'>Project CamouCreator</a> by <a href='https://royvbtw.uk'>Roy Lu(royvbtw)</a> Oct, 2017
        </footer>
      </div>
    );
  }
}

export default App;
