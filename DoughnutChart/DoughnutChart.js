import React from 'react';
import './DoughnutChart.css'

export default class extends React.Component {
  constructor(props){
    super(props)
		this.state = {}
		this.initProps()
		this.processData()
	}

	initProps(){
        let {
			diam = 342,
			borderWInn = 40,
			borderWOtr = 20,
            padding = [160,350,0,100],
            lineLon = [70,200],
			data = [
				{name:'1',value:20,color:'#7cb5ec',unit:"%"},
				{name:'2',value:30,color:'#2b908f',unit:"%"},
				{name:'3',value:50,color:'#90ed7d',unit:"%"},
			]
		} = this.props
    
        // from props
		this.diam = diam
		this.borderWInn = borderWInn
        this.borderWOtr = borderWOtr
        this.lineLon = lineLon
		this.padding = (function(){
			if (padding.length === undefined || padding.length < 4) {
				throw new Error("Format of the property 'padding':[number x 4]")
			} else {
				return padding
			}
		}())
		this.data = data
        
        // new 
		this.wholeWidth = diam + this.padding[1] + this.padding[3]
		this.wholeHeight = diam + this.padding[0] + this.padding[2]
		this.borderTop = this.padding[0]
		this.borderBottom = diam + this.padding[2]
		this.borderLeft = this.padding[3]
		this.borderRight = diam + this.padding[1]
        this.innerR = (diam-borderWInn) / 2
        
        //private
        this.linePos = 0.4
	}

	processData(){
		const {	data, innerR, lineLon, linePos } = this

		this.data = data.map((item,index)=>{
			const accPercent = (()=>{
				let temp = 0
				for(let i=0;i<index;i++){
					temp+=data[i].value
				}
				return temp
            })()

            const accDegree = {
                start:this.getDegreeFromPercent(accPercent),
                end:this.getDegreeFromPercent(item.value+accPercent),
                line:this.getDegreeFromPercent(item.value*linePos + accPercent)
            }
            const start = this.getCoordinate(accDegree.start,innerR)
			const end = this.getCoordinate(accDegree.end,innerR)
			const lineStart = this.getCoordinate(accDegree.line,innerR)
			const lineMiddle = this.getCoordinate(accDegree.line,innerR+lineLon[0])
			const lineEnd = {
				x: item.value*0.4 + accPercent<50 ? lineMiddle.x-lineLon[1] : lineMiddle.x+lineLon[1],
                y: lineMiddle.y
			}
			item.start = start
			item.end = end
			item.lineStart = lineStart
			item.lineMiddle = lineMiddle
			item.lineEnd = lineEnd
			item.lineTextAnchor = accDegree.line < 180 ? 'end':'start'
			return item
		})
	}

    getCoordinate(degree,r){
        const arc = degree * Math.PI*2 / 360 
		return {
			x: this.wholeWidth/2 - r * Math.sin(arc),
			y: this.wholeHeight/2 - r * Math.cos(arc)
		}
    }

    getDegreeFromPercent(percent){
        return parseInt(percent)/100*360
    }

  render () {
		const {
			wholeWidth,
			wholeHeight,
			borderWInn,
			borderWOtr,
			data,
			diam
		} = this
		const { startAnimation } = this.props
		
    	return (
			<svg width={wholeWidth} height={wholeHeight}>
				<circle className={startAnimation ? "DoughnutChart-animation-chart" : ''} cx={wholeWidth/2} cy={wholeHeight/2} r={diam/2+borderWOtr/2} stroke="rgba(1, 112, 144, 0.4)" strokeWidth={borderWOtr} fill="transparent"></circle>
				{
					data.map(({name,value,color,unit,start,end,lineStart,lineMiddle,lineEnd,lineTextAnchor},index) => {return(
						<g key={index}>
							{/* blocks of Doughnut */}
							<path
								className={startAnimation ? "DoughnutChart-animation-chart" : ''}
								d={`
                                    M ${start.x} ${start.y} 
                                    A ${this.innerR} ${this.innerR}, 0, ${Number(value>50)}, 0, ${end.x} ${end.y}
								`} 
								stroke={color}
								strokeWidth={borderWInn}
								fill={'transparent'}
								strokeOpacity="0.8"
								strokeLinecap="butt"
							/>
							{/* lineText */}
							<g className={startAnimation ? "DoughnutChart-animation-lineText" : ''}>
								<path
									d={`
                                        M ${lineStart.x} ${lineStart.y}
                                        L ${lineMiddle.x} ${lineMiddle.y}
                                        H ${lineEnd.x}
									`}
									strokeWidth={2}
									strokeLinecap="round"
									stroke={"rgba(255,255,255,0.6)"}
									fill="transparent"
								></path>
								<text 
									x={lineMiddle.x} y={lineMiddle.y - 10} 
									textAnchor={lineTextAnchor}>
									<tspan 
										fontFamily={"HYQiHeiY1-55W"} 
										fontSize="28px"
										fill="white"
									>
										{name}
									</tspan>
									<tspan
										dx={10} 
										dy={2}
										fontFamily={"AgencyFB-Bold"} 
										fontSize="30px"
										fill="white"
										dominantBaseline="auto" //middle,hanging
									>
										{value + '%'}
									</tspan>
								</text>
							</g>
						</g>
					)})
				}
			</svg>
    )
  }
}