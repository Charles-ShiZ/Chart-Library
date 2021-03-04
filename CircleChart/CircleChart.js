import React from 'react'
import './CircleChart.css'
export default class extends React.Component {
  static defaultProps = {
    width: 707,
    height: 486,
    lines: [6,7],
    rMax: 35,
    padding:[20,100,100,120],
    labelSize:30,
    startAnimation: false,
    axisLabel: [
      ['车流量','人流量','噪声值','VOC','PM2.5','温度','湿度'],
      ['照明','空调','电梯','供暖','变配电','给排水']
    ],
    data:[ 
      [
        {r:'22',solid:true},
        {r:'10',solid:true},
        {r:'10',solid:false},
        {r:'22',solid:true},
        {r:'10',solid:true},
        {r:'22',solid:true},
      ]
    ]
  }
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {
      width,
      height,
      padding,
      lines,
      rMax,
      startAnimation,
      data,
      axisLabel,
      labelSize
    } = this.props

    if(!Array.isArray(data) || !data.length) {
      return <div></div>
    }

    const perWidth = width/(lines[0]+1)
    const perHeight = height/(lines[1]+1)
    
    const Hline = new Array(lines[0]).fill('')
    const Vline = new Array(lines[1]).fill('')
    return (
      <svg width={width+padding[1]+padding[3]} height={height+padding[0]+padding[2]}>
        <rect 
          x={padding[3]} y={padding[0]} 
          width={width} height={height}
          stroke={'rgba(255,255,255,1)'}
          fill={'transparent'}
        ></rect>
        {
          Hline.map((_,index1)=>{
            return(
              <g key={index1} >
                <text 
                  x={perWidth * (index1 + 1)+padding[3]} 
                  y={height+padding[0]+ labelSize*1.3} 
                  fontFamily={'HYQiHeiY1-45w'}
                  fontSize={labelSize}
                  textAnchor="middle"
                  fill={'white'}
                >{axisLabel[1][index1]}</text>
                <path d={`M${perWidth * (index1 + 1)+padding[3]} ${padding[0]} V${height+padding[0]}`} stroke={'rgba(255,255,255,.3)'}></path>
                {
                  Vline.map((_,index2)=>{
                    return (
                      <circle 
                        className={startAnimation?"CircleChartAnimation":''}
                        key={index2} 
                        cx={perWidth * (index1 + 1) + padding[3]} 
                        cy={perHeight * (index2 + 1) + padding[0]} 
                        r={(data[index2][index1].r/100)*rMax}
                        stroke={data[index2][index1].solid?'':'rgba(84, 214, 252, 1)'}
                        strokeWidth={2}
                        fill={data[index2][index1].solid?'rgba(84, 214, 252, 1)':'rgba(84, 214, 252, .05)'}
                      >
                      </circle>
                    )
                  })
                }
              </g>
            )
          })
        }
        {
          Vline.map((_,index)=>{
            return(
              <g>
                <text 
                  x={padding[3]-labelSize*0.5} 
                  y={perHeight * (index + 1) + padding[0] +labelSize*0.3} 
                  fontFamily={'HYQiHeiY1-45w'}
                  fontSize={labelSize+'px'}
                  fill={'white'}
                  textAnchor={"end"}
                >{axisLabel[0][index]}</text>
                <path key={index} d={`M${padding[3]} ${perHeight * (index + 1)+padding[0]} H${width+padding[3]}`} stroke={'rgba(255,255,255,.3)'}></path>
              </g>
            )
          })
        }
      </svg>
    )
  }
}