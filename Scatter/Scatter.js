import React from 'react'
import './Scatter.css'
function getRandom(Min,Max){
  const range = Max - Min;
  const random = Math.random();
  const num = Min + Math.round(random * range); //四舍五入
  return num;
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {
      data = [
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5],
        [1,2,3,4,5,6,1,2,3,4,5]
      ],
      label = {
        x:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
        y:['会议室7','会议室6','会议室5','会议室4','会议室3','会议室2','会议室1'],
        fontSize:36,
        fontFamily:'HYQiHeiY1-35W',
        color:'#CCCCCC'
      },
      axis = {
        x:{
          color:'rgba(255,255,255,.6)'
        },
        y:{
          color:'rgba(255,255,255,.2)'
        }
      },
      width = 500,
      height = 447,
      padding = {
        top:10,
        left:150,
        right:120,
        bottom:50
      },
      grid = {
        lineColor:'rgba(255,255,255,.2)'
      },
      dot = {
        width: 5,
        color:'#54D6FC'
      },
      startAnimation = false
    } = this.props
    const svgWidth = width + padding['left'] + padding['right']
    const svgHeight = height + padding['top'] + padding['bottom']

    const xSt = padding['left'] //10
    const ySt = padding['top'] //10
    const xEnd = svgWidth - padding['right'] //490
    const yEnd = svgHeight - padding['bottom'] //490

    const xNum = data[0] ? data[0].length : 0
    const yNum = Number(data.length)

    const xLenEach = (xEnd - xSt) / xNum
    const yLenEach = (yEnd - ySt) / yNum
    
    const hLines = (() =>{
      const t = []
      for(let i = 0 ; i <= yNum; i++) {
        t.push(ySt + i * yLenEach)
      }
      return t
    })()

    const vLines = (() =>{
      const t = []
      for(let i = 0 ; i <= xNum; i++) {
        t.push(xSt + i * xLenEach)
      }
      return t
    })()
    
    const dots = (()=>{
      const t = []

      for(let i = 0 ; i < yNum ; i ++) {
        let border = {}
        for(let j = 0 ; j < xNum ; j ++) {
          border['top'] = hLines[i] + dot['width']/2
          border['bottom'] = hLines[i] + yLenEach - dot['width']/2
          border['left'] = vLines[j] + dot['width']/2
          border['right'] = vLines[j] + xLenEach - dot['width']/2
          for(let z = 0 ; z < data[i][j] ; z ++) {
            t.push({
              cy: getRandom(border['top'], border['bottom']),
              cx: getRandom(border['left'], border['right'])
            })
          }
        }
      }
      return t
    })()
    
    return (
      <div>
        <svg width={svgWidth} height={svgHeight}>
          {/* 单位 */}
          <text 
            x={svgWidth*0.94} y={svgHeight*0.977} 
            textAnchor="end" 
            dominantBaseline="baseline"
            fontSize={label['fontSize']} 
            fontFamily={label['fontFamily']}
            fill={label['color']} 
          >{'(时)'}</text>
          {/* 背景网格 */}
          <g>
            {
              hLines.map((item, index) => {
                return (
                  <g key={index}>
                    <text 
                      x={xSt - 15} y={(item*2 + yLenEach)/2} 
                      textAnchor="end" 
                      dominantBaseline="hanging"
                      fontSize={label['fontSize']} 
                      fontFamily={label['fontFamily']}
                      fill={label['color']}
                    >
                      {label['y'][index]}
                    </text>
                    <path 
                      d={`M${xSt} ${item} H${xEnd}`} 
                      stroke={ index === yNum ? axis.x.color:grid.lineColor} 
                      strokeWidth="2"
                    ></path>
                  </g>
                )
              })
            }
            {
              vLines.map((item, index) => {
                return (
                  <g key={index} >
                    <text 
                      style={{
                        display:(index%2 > 0) ? 'none' : ''
                      }}
                      x={(item*2 + xLenEach)/2} y={yEnd + 15} 
                      fontSize={label['fontSize']} 
                      fontFamily={label['fontFamily']}
                      textAnchor="middle" 
                      dominantBaseline="hanging"
                      fill={label['color']}
                    >
                      {label['x'][index]}
                    </text>
                    <path 
                      d={`M${item} ${ySt} V${yEnd}`} 
                      stroke={ index === 0 ? axis.y.color:grid.lineColor} 
                      strokeWidth="2"
                    ></path>
                  </g>
                )
              })
            }
          </g>

          {/* 撒点 */}
          <g>
            {
              dots.map(({cx,cy}, index) => {
                return (
                  <circle 
                    className = {startAnimation?'animation-randonDotsChart':''}
                    key = {index}
                    cx = {cx}
                    cy = {cy}
                    r = {dot['width']/2}
                    stroke = {dot['color']}
                    fill = {dot['color']}
                  ></circle>
                )
              })
            }
          </g>
        </svg>
      </div>
    )
  }
}