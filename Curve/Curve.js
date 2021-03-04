import React from "react";
import { insertCSSToStyleSheets } from 'commonFn.js'
import './Curve.css'
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.hasAddedAnimationCSS = 0
  }
  addAnimationCSS(index){
    const {data = [], name = 'curve'} = this.props
    if(this.hasAddedAnimationCSS >= data.length) return

    const curve = document.getElementById(`${name}${index}`)
    if(curve){
      const curveLon = curve.getTotalLength()
      insertCSSToStyleSheets([
        ` 
          .${name}${index} {
            text-align:justify;
            stroke-dasharray: ${curveLon};
            stroke-dashoffset: 0;
            animation: ${name}Anima${index} 4s linear;
          }
        `,
        ` 
          @keyframes ${name}Anima${index} {
            from {
              stroke-dashoffset: ${curveLon};
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `
      ])
      this.hasAddedAnimationCSS ++
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.startAnimation !== this.props.startAnimation){
      this.hasAddedAnimationCSS = 0
      this.addAnimationCSS()
    }
  }
  render() {
    const {
      name = 'CurvePath',
      width, 
      height,
      data, // 图表数据
      barData = [], // 柱状条数据
      xAxis = [], // x轴数据
      yMax, yAcc, // y轴数据相关
      yMaxRight, yAccRight, // y轴数据相关(右侧)
      yUnit = '',
      colors,
      barGradient,
      fontSize = 20,
      dasharray = '',
      axisColor = '#fff',
      lineColor = 'rgba(255,255,255,0.1)',
      stripe = false,
      xFontSize =  '30',
      barWidth = 16,
      startAnimation = false
    } = this.props

    const xMax = xAxis.length
    const xAcc = 1
    // 柱状图渐变色
    const _barGradient = (()=>{
      let temp = []
      switch (Object.prototype.toString.call(barGradient)) {
        case '[object String]':
          temp.push(barGradient,'transparent')
          break;
        
        case '[object Array]':
          temp = barGradient
          break;
        default:
          break;
      }
      return temp
    })()

    //y轴数据
    const yAxis = (() => {
      const yAxis = []
      for(let i = 0 ; i <= yMax ; i += yAcc) {
        if((String(yMax - i)).length > 4) {
          const arr = String(yMax - i).split('')
          arr[arr.length - 3] = ','
          arr.push('0')
          yAxis.push(arr.join(''))
        } else {
          yAxis.push(yMax - i)
        }
      }
      return yAxis
    })()

    //右侧y轴数据
    const yAxisRight = (() => {
      const yAxisRight = []
      for(let i = 0 ; i <= yMaxRight ; i += yAccRight) yAxisRight.push(yMaxRight - i)
      return yAxisRight
    })()
 
    const xSt = width * .1
    const xEnd = width * .9
    const ySt = height * .15

    const xLon = width * .8
    const yLon = height * .7

    const yEnd = ySt + yLon

    const xPerNum = xMax / xAcc
    const yPerNum = yMax / yAcc

    const xLonPer = xLon / (xPerNum - .7)
    const yLonPer = yLon / yPerNum

    const xOffset = fontSize * .4
    const yOffset = fontSize * 1.5

    const curveXSt = xSt + xLonPer / 9
    const barXSt = xSt + xLonPer / 9 - barWidth / 2
    
    // 准备曲线路径
    const ds = (()=>{
      const ds = []
      if(!data) return ds
      for(let j = 0 ; j < data.length ; j ++) { //循环多条曲线
        ds[j] = ''
        for(let i = 0 ; i < xMax ; i ++) { //循环曲线的点
          const prevDot = { //上一个点
            x: curveXSt + (i - 1) * xLonPer,
            y: yEnd - data[j][ i - 1 ]*(yLon/yMax)
          },
          dot = { //当前这个点
            x: curveXSt + (i) * xLonPer,
            y: yEnd - data[j][ i ]*(yLon/yMax)
          },
          nextDot = { //下一个点
            x: curveXSt + (i + 1) * xLonPer,
            y: yEnd - data[j][ i + 1 ]*(yLon/yMax)
          },
          prevMiddleX = (prevDot.x + dot.x) / 2,  //上一个中间点
          nextMiddleX = (nextDot.x + dot.x) / 2,  //下一个中间点
          prevMiddleY = dot.y,  //上一个中间点
          nextMiddleY = dot.y   //下一个中间点
          
          switch (i) {
            case 0: // 第一个点
              ds[j] += `M ${dot.x} ${dot.y} C ${dot.x} ${dot.y} `
              break;

            case xMax - 1: // 最后一个点
              ds[j] += `${dot.x} ${dot.y} ${dot.x} ${dot.y} `
              break;

            default: // 中间的点
              ds[j] += `${prevMiddleX} ${prevMiddleY} ${dot.x} ${dot.y} C ${nextMiddleX} ${nextMiddleY} `
              break;
          }
        }
      }
      return ds
    })()
    
    const baseD = `V${yEnd - 20} H${curveXSt} Z`

    return (
      <div>
        <div id="texxxt" className="texxxt"></div>
        <svg width={`${width}px`} height={`${height}px`}>
          <defs>
            <linearGradient id={`${name}BarLinear`} gradientTransform="rotate(90)">
              <stop className="horizonBarStart" offset="0%" />
              {/* <stop className="horizonBarMiddle" offset="60%" /> */}
              <stop className="horizonBarEnd" offset="100%" />
            </linearGradient>
            <style>
              {
                `#${name}BarLinear { 
                  fill: url(#${name}BarLinear) 
                }
                .horizonBarStart {
                  stop-color: ${_barGradient[0]}
                }
                .horizonBarMiddle{
                  stop-color: rgba(84, 214, 252, .5)
                }
                .horizonBarEnd {
                  stop-color: ${_barGradient[1]}
                }
                `
              }
            </style>

            {/* 纵向条纹 */}
            <linearGradient id={`${name}CurveLinear`}
              x1="0%" y1="0"
              x2="1.53%" y2="0"
              spreadMethod="repeat">
              <stop offset="0%" stopColor="rgba(84, 214, 252, .2)" />
              <stop offset="35%" stopColor="rgba(84, 214, 252, .2)" />
              <stop offset="35%" stopColor="transparent" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <text
            x={xSt - 12}
            y={ySt - fontSize* 1.3}
            textAnchor={'end'}
            fill={"rgba(255,255,255,0.6)"}
            fontSize={35}
            fontFamily="HYQiHeiY1-45W"
          >{yUnit?`(${yUnit})`:''}</text>

          {/* 数据线轮廓 */}
          {
            ds.map((d,index) => {return(
              <path key={index} 
                d={d + baseD} 
                fill={stripe?`url(#${name}CurveLinear)`:'transparent'}
                fillRule="nonzero"
                strokeWidth={3} stroke='transparent'></path>
            )})
          }

          {/* x轴和y轴 */}
          <path
            d = {` 
              M${xSt} ${ySt} 
              L${xSt} ${ySt + yLon} 
            `}
            stroke = {axisColor}
            fill = {'transparent'}
          />
          <path
            d = {` 
              M${xSt} ${ySt + yLon} 
              L${xSt + xLon} ${ySt + yLon} 
            `}
            stroke = {'rgba(255,255,255,.6)'}
            strokeWidth={3}
            fill = {'transparent'}
          />

          {/* y轴数据 */}
          {
            yAxis.map((value, index)=>{
              return(
                <g key={index}>
                  <text
                    x = {xSt - xOffset}
                    y = {ySt + index * yLonPer + yLonPer*.12} 
                    fontSize = {35}
                    fontFamily = "HYQiHeiY1-35W"
                    textAnchor = {'end'}
                    fill = {'rgba(255,255,255,0.6)'}
                  >
                    {value}
                  </text>
                  <path
                    d = {`
                      M${xSt} ${ySt + index * yLonPer}
                      H${xSt + xLon}
                    `} 
                    stroke = {lineColor}
                    strokeWidth = {2}
                    strokeDasharray = {dasharray}
                  />
                </g>
              )
            })
          }

          {/* 柱状图y轴数据 右侧 */}
          {
            yAxisRight.map((value, index)=>{
              return(
                <g key={index}>
                  <text
                    x = {xEnd + xOffset + fontSize/2}
                    y = {ySt + index * yLonPer + yLonPer*.2} 
                    fontSize = {fontSize}
                    textAnchor = {'middle'}
                    fill = {'rgba(255,255,255,0.6)'}
                  >
                    {value}
                  </text>
                </g>
              )
            })
          }

          {/* x轴数据 */}
          {
            xAxis.map((value, index)=>{
              return(
                <text
                  key={index}
                  x = {curveXSt + index * xLonPer + xOffset*0.2}
                  y = {yEnd + yOffset} 
                  fontSize = {xFontSize}
                  textAnchor = {'middle'}
                  fontFamily={'HYQiHeiY1-35W'}
                  fill = {'rgba(255,255,255,0.6)'}
                >
                  {value}
                </text>
              )
            })
          }

          {/* 柱状图 */}
          {
            barData.map((value,index)=>{
              return (
                <rect 
                  id='BarLinear'
                  key={index}
                  x={barXSt + index * xLonPer} 
                  y={yEnd - value*(yLon/yMax)} 
                  width={barWidth} 
                  height={value*(yLon/yMax)} 
                  fill={`url(#${name}BarLinear)`}
                  transform = {`rotate(180,${((barXSt + index * xLonPer)*2 + 15)/2},${(yEnd*2 - value*(yLon/yMax))/2})`}
                  className={startAnimation ? 'curveBar':''}
                ></rect>
              )
            })
          }
          
          {/* 数据线 */}
          {
            ds.map((d,index) => {return(
              <path id={`${name}${index}`} className={`${name} ${startAnimation ? name + index : ''}`} key={index} d={d} 
                fill = "transparent"
                fillRule="nonzero"
                strokeWidth={4} stroke={colors[index]}
                onLoad={
                  this.addAnimationCSS(index)
                }
              ></path>
            )})
          }
        </svg>
      </div>
    );
  }
}
