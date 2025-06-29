import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import Trafficlight from './Trafficlight';

export default class LiveTraffic extends Component {
  static defaultProps = {
    center: { lat: 17.3753, lng: 78.5584 }, // Uppal X Road center
    zoom: 18
  };

  constructor() {
    super();
    this.countdown = this.countdown.bind(this);
    this.state = {
      countdown: 0,
      l1: 'red',
      l2: 'red',
      l3: 'red',
      l4: 'red',
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0
    };
  }

  carf(total) {
    return total < 20
      ? 20
      : total < 40
        ? 40
        : total < 60 ? 60 : total < 80 ? 80 : total < 100 ? 100 : 120;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  countdown(time) {
    let timer = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({
          countdown: this.state.countdown - 1
        });
      } else {
        clearInterval(timer);
        this.setState({
          countdown: time
        });
      }
    }, 1000);
  }

  componentDidMount() {
    const rand = (num) => Math.floor(Math.random() * num) + 1;
    const change = async () => {
      const lanes = 4;
      let n = 4, m = 0, flag = 1;
      let burst_time;

      while (1) {
        if (flag) {
          burst_time = [rand(20), rand(20), rand(20), rand(20)];
          flag = !flag;
        }

        for (let k = 0; k < 4; k++) {
          this.setState({
            [`c${k + 1}`]: burst_time[k]
          });
        }

        const changeTraffic = i => {
          for (let k = 0; k < 4; k++) {
            if (i === k) {
              burst_time[i] -= rand(Math.ceil(burst_time[i] / 2));
              this.setState({
                [`c${i + 1}`]: burst_time[i]
              });
            } else {
              burst_time[k] += rand(3);
              this.setState({
                [`c${k + 1}`]: burst_time[k]
              });
            }
          }
        };

        let totalNoOfCars = burst_time.reduce((i, val) => val + i);
        let totalTime = this.carf(totalNoOfCars);
        let laneTime = [];

        for (let i = 0; i < n; i++) {
          laneTime.push(Math.ceil(burst_time[i] / totalNoOfCars * totalTime));
        }

        if (m > 3) {
          m -= 4;
        }

        let y = laneTime[m];
        if (y < totalTime / 10) {
          y = totalTime / 10;
        }
        if (y > totalTime / 3) {
          y = totalTime / 3;
        }

        this.setState({
          [`l${m + 1}`]: 'green'
        });

        let x = 0;
        while (burst_time[m] !== 0 && x <= y) {
          await this.sleep(3000);
          changeTraffic(m);
          x += 3;
        }

        this.setState({
          [`l${m + 1}`]: 'yellow'
        });

        await this.sleep(3000);
        this.setState({
          [`l${m + 1}`]: 'red'
        });

        m += 1;
      }
    };

    change();
  }

  render() {
    return (
      <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        layerTypes={['TrafficLayer']}
        options={{ styles: style }}
        bootstrapURLKeys={{
          key: 'AIzaSyAtx_lIJ0GsFLKtlaCsMyo7K7Rq8IeTCx4'
        }}
      >
        <div>{this.state.countdown}</div>

        {/* Trafficlights around Uppal X Road, Hyderabad */}
        <Trafficlight color={this.state.l1} count={this.state.c1} lat={17.3753} lng={78.5584} />
        <Trafficlight color={this.state.l2} count={this.state.c2} lat={17.3758} lng={78.5589} />
        <Trafficlight color={this.state.l3} count={this.state.c3} lat={17.3747} lng={78.5594} />
        <Trafficlight color={this.state.l4} count={this.state.c4} lat={17.3742} lng={78.5578} />
        <Trafficlight color={this.state.l1} count={this.state.c1} lat={17.3734} lng={78.5597} />
        <Trafficlight color={this.state.l2} count={this.state.c2} lat={17.3755} lng={78.5570} />
        <Trafficlight color={this.state.l3} count={this.state.c3} lat={17.3745} lng={78.5560} />
        <Trafficlight color={this.state.l4} count={this.state.c4} lat={17.3739} lng={78.5572} />
        <Trafficlight color={this.state.l2} count={this.state.c2 + 3} lat={17.3765} lng={78.5566} />
      </GoogleMapReact>
    );
  }
}

const style = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#7c93a3' },
      { lightness: '-10' }
    ]
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#a0a4a5' }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#62838e' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#dde3e3' }]
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#3f4a51' },
      { weight: '0.30' }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'poi.attraction',
    elementType: 'all',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.government',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'poi.place_of_worship',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.school',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      { saturation: '-100' },
      { visibility: 'on' }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#bbcacf' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { lightness: '0' },
      
      { color: '#bbcacf' },
      { weight: '0.50' }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#a9b4b8' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [
      { invert_lightness: true },
      { saturation: '-7' },
      { lightness: '3' },
      { gamma: '1.80' },
      { weight: '0.01' }
    ]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#a3c7df' }]
  }
];