import React from 'react'
import './Mileometer.css'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      percent:0
    }
  }
  render () {
    const {percent} = this.props
    const {startAnimation} = this.props
    const width = 500
    const height = 500
    const cx = width/2
    const cy = height/2
    const r = 405/2
    const r2 = 355/2
    const r3 = 295/2
    const circumference = Math.PI*r*2 //最外层圆长
    const _circumference = circumference * .61 //最大变化周长
    const _percent = percent/100 //转化为小数
    const fontSize = 116
    return (
      <svg width={width} height={height} viewBox="0 0 550 550">
        
        {/* 背景 */}
        <g>
          {/* 圆1 */}
          <circle cx={cx} cy={cy} r={r} 
            fill={'transparent'} 
            strokeWidth={2} 
            stroke={'url(#MileometerGradient)'}
            strokeDasharray={`${circumference * .6}`}
            strokeLinecap="round"
            transform = {`rotate(162,${cx},${cy})`}
          >
          </circle>
          {/* 圆2 */}
          <circle cx={cx} cy={cy} r={r2} 
            fill={'transparent'} 
            strokeWidth={15} 
            stroke={'url(#MileometerGradient)'}
            strokeDasharray={`${circumference * .527}`}
            strokeLinecap="round"
            transform = {`rotate(162,${cx},${cy})`}
          >
          </circle>
          {/* 圆3 */}
          <g>
            <circle cx={cx} cy={cy} r={r3} 
              fill={'transparent'} 
              strokeWidth={15} 
              stroke={'rgba(158, 156, 188, 1)'}
              strokeDasharray={`2 10.5`}
              clipPath="url(#cut-off-circle)"
            >
            </circle>
            <defs>
              <clipPath id="cut-off-circle">
                <rect x="0" y="0" width={width} height="305" />
              </clipPath>
            </defs>
          </g>
          <defs>
              <linearGradient 
                  id="MileometerGradient"
                  x1="0%" y1="0"
                  x2="100%" y2="0"
              >
                  <stop offset="0%" stopColor="#948BFF" />
                  <stop offset="100%" stopColor="#9EC1FA" />
              </linearGradient>
          </defs>
        </g>
        
        {/* 动态圆 */}
        <g>
          <circle cx={cx} cy={cy} r={r} 
            className={startAnimation ? 'Mileometer-Animation-arc' : ''}
            fill={'transparent'} 
            strokeWidth={18} 
            stroke={'url(#dynamicCircle)'}
            strokeDasharray={`
              ${_circumference * _percent} 
              ${circumference - _circumference*_percent}
            `}
            transform = {`rotate(160,${cx},${cy})`}
          >
          </circle>

          <circle cx={cx} cy={cy} r={r2} 
            className={startAnimation ? 'Mileometer-Animation-dot' : ''}
            fill={'transparent'} 
            strokeWidth={20} 
            strokeLinecap = "round"
            stroke={'#fff'}
            strokeDasharray={`${(1)} ${circumference - 1}`}
            transform = {`rotate(${162 + (378-162) * _percent},${cx},${cy})`}
          >
          </circle>

          <defs>
              <linearGradient 
                  id="dynamicCircle"
                  x1="0%" y1="0"
                  x2="100%" y2="0"
              >
                  <stop offset="0%" stopColor="rgba(78, 186, 255, .5)" />
                  <stop offset="50%" stopColor="rgba(78, 186, 255, .3)" />
                  <stop offset="100%" stopColor="transparent" />
              </linearGradient>
          </defs>
        </g>
        
        <text x={cx-fontSize*.56} y={cy + fontSize*.35} 
          fill={'rgba(84, 214, 252, 1)'} 
          fontFamily='AgencyFB-Bold'
          fontSize={fontSize}
        >
          <tspan>{percent}</tspan>
          <tspan fontSize={fontSize*.5}>%</tspan>
        </text>

      </svg>
    )
  }
}