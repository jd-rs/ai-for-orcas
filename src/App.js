import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import colormap from 'colormap';
import { DataSet, Timeline } from "vis-timeline/standalone";

import './App.css';


class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = { play: false };
  }

  componentDidMount() {
    const colors = colormap({
      colormap: 'temperature',
      nshades: 256,
      format: 'float'
    });

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#FFFFFF',
      progressColor: '#7B68EE',
      cursorColor: '#FFFFFF',
      barWidth: 4,
      barRadius: 3,
      responsive: true,
      barGap: 2,
      cursorWidth: 1,
      scrollParent: false,
      height: 80,
      normalize: true,
      plugins: [
        SpectrogramPlugin.create({
          container: '#waveform-spectrogram',
          colorMap: colors
        })
      ]
    });

    this.wavesurfer.load(`sounds/sound${this.props.item}.wav`);

    this.wavesurfer.on('finish', () => this.setState({ play: false }));
  };

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.wavesurfer.load(`sounds/sound${this.props.item}.wav`);
      this.setState({
        play: false,
      });
    }
  }

  handlePlayButtonClick() {
    this.wavesurfer.playPause();
    this.setState(state => ({
      play: !state.play,
    }));
  }

  render() {
    const extraClassName = this.props.isQuery ? "" : "not-query";

    return (
      <div className='Widget'>
        <div className='progress-bar'><div></div></div>
        <button className='play-pause-button' onClick={() => this.handlePlayButtonClick()}>
          <span className={this.state.play ? 'play' : 'pause'}></span>
        </button>
        <button className='accuracy'>0.60</button>
        <div className='waveform-container'>
          <div id='waveform'></div>
          <div id='waveform-spectrogram'></div>
        </div>
        <button className={`orca ${extraClassName}`} onClick={() => this.props.onLabelButtonClick(this.props.item, true)}>Orca</button>
        <button className={`not-orca ${extraClassName}`} onClick={() => this.props.onLabelButtonClick(this.props.item, false)}>Not</button>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      currentItem: 6,
      currentGroup: 3,
    };
  }

  componentDidMount() {
    this.items = new DataSet([
      {
        id: 1, group: 1, content: '<img src="icons/orca.png" style="width:48px; height:48px;" id="myImage">', start: '2013-04-13', className: 'certain'
      },
      {
        id: 2, group: 2, content:
          '<img src="icons/orca-black.png" style="width:48px; height:48px;">', start: '2013-04-14'
      },
      {
        id: 3, group: 1, content:
          '<img src="icons/orca.png" style="width:48px; height:48px;">', start: '2013-04-18'
      },
      {
        id: 6, group: 3, content:
          '<img src="icons/question.png" style="width:48px; height:48px;">', start: '2013-04-19'
      },
      {
        id: 4, group: 3, content:
          '<img src="icons/question.png" style="width:48px; height:48px;">', start: '2013-04-15'
      },
      {
        id: 5, group: 3, content:
          '<img src="icons/question.png" style="width:48px; height:48px;">', start: '2013-04-16'
      },
    ]);

    const options = {};

    this.timeline = new Timeline(this.myRef.current, this.items, options);
    this.timeline.setSelection(this.state.currentItem);
    this.timeline.on('click', (properties) => this.handleIconClick(properties.item));
  }

  handleLabelButtonClick(i, isOrca) {
    const item = this.items.get(i);
    // if (item.group === 3) {
    if (isOrca) {
      item.content = '<img src="icons/orca-black.png" style="width:48px; height:48px;">';
      item.group = 2;
      this.items.update(item);
    }
    else {
      // this.items.remove(item);
      item.content = '';
      item.group = 4;
      this.items.update(item);
    }
    // }
  }

  handleIconClick(selectedItem) {
    this.setState({
      currentItem: selectedItem,
      currentGroup: this.items.get(selectedItem).group,
    });
  }

  render() {
    return (
      <div className='App'>
        <header>
          <a href='http://www.orcasound.net/' >Orcasound | </a>
          <span id='project'>AI for Orcas</span>
        </header>
        <div className='top-container background-filter'>
          <Widget item={this.state.currentItem} isQuery={this.state.currentGroup === 3} onLabelButtonClick={(i, isOrca) => this.handleLabelButtonClick(i, isOrca)} />
        </div>
        <div className='bottom-container'>
          <div ref={this.myRef}></div>
        </div>
      </div>
    );
  }
}

export default App;
