import React from 'react'
import './DoubleBar.css'
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const {
      name,
      value = '10_20',
      max = 25,
      startAnimation = false
    } = this.props
    const valueArr = value.split('_')
    const value1 = valueArr[0]
    const value2 = valueArr[1]
    return (
      <div className="DoubleBar">
      <div className="baritem">
          <div className="baritemtitle">{name}</div>
          <div className="baritemr">
              <p style={{width:'100%'}}></p>
              <p className={startAnimation ? 'DoubleBar-Animation' : ''} style={{borderRadius:'10px',width:value2*100/max+'%',backgroundColor:'rgba(0, 187, 210, 1)'}}></p>
              <p className={startAnimation ? 'DoubleBar-Animation' : ''} style={{borderRadius:'10px',width:value1*100/max+'%',backgroundColor:'rgba(44, 255, 153, 1)'}}></p>

              <div className={`barlabel ${startAnimation ? 'DoubleBar-valueAnimation' : ''}`} style={{left:value1*100/max+'%'}}>{value1}</div>
              <div className={`barlabel ${startAnimation ? 'DoubleBar-valueAnimation' : ''}`} style={{left:value2*100/max+'%'}}>{value2}</div>
          </div>
      </div>
  </div>
    )
  }
}