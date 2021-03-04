//ecg 心电图缩写
import React from "react";
import socket from "socket";
export default class EcgPie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      d:'',
      ecgs:[
        `M 20 ${120} Q 30 ${80}  40 ${130}
                     Q 50 ${140} 60 ${80}
                     Q 70 ${70}  80 ${150}
                     Q 90 ${160}  100 ${50}
                     Q 110 ${60}  120 ${160}
                     Q 130 ${170}  140 ${40}
                     Q 150 ${30}  160 120
                     Q 170 ${130}  180 ${120}
        `,
        `M 20 ${120} Q 30 ${120}  40 ${80}
                     Q 50 ${70} 60 ${110}
                     Q 70 ${120}  80 ${45}
                     Q 90 ${50}  100 ${130}
                     Q 110 ${140}  120 ${30}
                     Q 130 ${35}  140 ${160}
                     Q 150 ${165}  160 ${100}
                     Q 170 ${111}  180 ${120}
        `,
        `M 20 ${120} Q 30 ${70}  40 ${140}
                     Q 50 ${130} 60 ${90}
                     Q 70 ${60}  80 ${150}
                     Q 90 ${160}  100 ${40}
                     Q 110 ${60}  120 ${150}
                     Q 130 ${170}  140 ${50}
                     Q 150 ${30}  160 ${110}
                     Q 170 ${130}  180 ${120}
        `
      ]
    };
  }

  startEcgAnimation(){
    let i = 0
    setInterval(()=>{
      const { ecgs } = this.state
      this.setState({
        d: ecgs[i]
      })
      i = (i + 1) % 3
    },150)
  }

  increaseEffect = (property,final,dur) => {
    clearInterval(this.state.interval)
    let origin = final > 100? (final - 100) : 0
    this.setState({
      [property]: origin
    })
    const interval = setInterval(() => {
      origin++
      this.setState({
        [property]: origin,
        interval:interval
      })
      if(this.state[property] >= final)
      {
        clearInterval(interval)
        this.setState({
          [property]: final
        })
      }
    }, dur);
  }

  componentDidMount () {
    const {
      value = 50
    } = this.props
    this.startEcgAnimation()
    this.increaseEffect('value', value , 50)

    socket.on('ctrl',()=>{
      const {
        value = 50
      } = this.props
      this.increaseEffect('value', value , 50)
    })
  }

  render () {
    const {
      width = 200,
      height = 200,
      r = [90,80],
      pieWidth = [3,7],
      pieColor = ['rgba(25, 228, 252, 1)','rgba(0, 255, 222, 1)'],
      textColor = 'rgba(84, 214, 252, 1)',
      unit = ''
    } = this.props
    const {
      d,
      value,
      ecgs
    } = this.state

    const circum = r[1] * 2 * Math.PI;
    const cx = width/2;
    const cy = height/2;

    return (
      <div>
        <svg id="svg" width={`${width}px`} height={`${height}px`}>
          {/* 外层 */}
          <circle
            r={r[0]}
            cx={cx}
            cy={cy}
            id="circle"
            fill="transparent"
            stroke={pieColor[0]}
            strokeWidth={pieWidth[0]}
            strokeLinecap="round"
          />
          {/* 内层 */}
          <circle
            r={r[1]}
            cx={cx}
            cy={cy}
            id="circle"
            fill="transparent"
            stroke={pieColor[1]}
            strokeWidth={pieWidth[1]}
            strokeDasharray={`${circum*.3} ${circum*.7}`}
            transform={`rotate(${-80},${cx},${cy})`}
          />
          <circle
            r={r[1]}
            cx={cx}
            cy={cy}
            id="circle"
            fill="transparent"
            stroke={pieColor[1]}
            strokeWidth={pieWidth[1]}
            strokeDasharray={2}
            transform={`rotate(${-100},${cx},${cy})`}
          />
          <circle
            r={r[1]}
            cx={cx}
            cy={cy}
            id="circle"
            fill="transparent"
            stroke={pieColor[1]}
            strokeWidth={pieWidth[1]}
            strokeDasharray={`${circum*.27} ${circum*.12} ${circum*.27} ${circum*.43} `}
            transform={`rotate(${-70},${cx},${cy})`}
          />
          <path strokeWidth={2} d={d} stroke="rgba(0, 255, 222, .1)" fill="transparent"/>
          {/* 数字 */}
          <text
            fontFamily="AgencyFB-Bold"
            x="99"
            y="110"
            fontSize="70"
            fill={textColor}
            textAnchor="middle" dominantBaseline="middle"
          >
            <tspan fontWeight="bold">{value}</tspan>
            <tspan fontSize="32" dy="5" fontFamily="SourceHanSansCN-Regular">{unit}</tspan>
          </text>
        </svg>
      </div>
    );
  }
}
