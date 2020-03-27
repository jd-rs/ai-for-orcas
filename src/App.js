import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js'
import colormap from 'colormap';
import Timeline from 'react-visjs-timeline'

import './App.css';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = { play: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.wavesurfer.playPause();
    this.setState(state => ({
      play: !state.play
    }));
  }

  componentDidMount() {
    const colors = colormap({
      colormap: 'temperature',
      nshades: 256,
      format: 'float'
    })

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
      barHeight: 20,
      plugins: [
        SpectrogramPlugin.create({
          container: '#waveform-spectrogram',
          colorMap: colors,
          responsive: true
        })
      ]
    });

    this.wavesurfer.load('https://jd-r-bucket.s3.amazonaws.com/Port-Townsend-2008-midnight.mp3');

    this.wavesurfer.on('finish', () => this.setState({ play: false }));
  };

  render() {
    return (
      <div className='Widget'>
        <div className='progress-bar'><div></div></div>
        <button className='play-pause-button' onClick={this.handleClick}>
          <span className={this.state.play ? 'play' : 'pause'}></span>
        </button>
        <button className='accuracy'>0.82</button>
        <div className='waveform-container'>
          <div id='waveform'></div>
          <div id='waveform-spectrogram'></div>
        </div>
        <button className='orca learner-button'>Orca</button>
        <button className='not-orca learner-button'>Not</button>
      </div>
    );
  }
}

function App() {
  const options = {
    width: '100%',
    height: '125px',
    stack: false,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 1000000,
    type: 'background',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    }
  }

  return (
    <div className='App'>
      <header>Orcasound</header>
      <div className='top-container background-filter'>
        <Widget />
      </div>
      <div className='Timeline'>
        <Timeline options={options} />
      </div>
    </div>
  );
}

export default App;
