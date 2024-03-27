import React from 'react'
import  './OneTime.css'

export default function OneTime({time, children, next}) {

    const [hoursSplit, minutes] = time.split(':'); 
    const hours = parseInt(hoursSplit)

    const hour = (hours > 12 ? hours - 12 : hours) * 30;
    const minute = parseInt(minutes) * 6;


  return (
    <div className={`bodyfortime ${next ? ('big') : ('')}`}>
        <div className={`clock`}>
            <div className="time"> 
              {time}
            </div>
            <div className={`wrap`}>
                <span style={{transform: `rotate(${hour}deg)`}} className={`hour`}></span>
                <span style={{transform: `rotate(${minute}deg)`}} className={`minute`}></span>
                {/* <span style={{transform: `rotate(${second}deg)`}} className={`second`}></span> */}
                <span className={`dot`}></span>
            </div>
        </div>
        <h3>{children}</h3>
    </div>
  )
}
