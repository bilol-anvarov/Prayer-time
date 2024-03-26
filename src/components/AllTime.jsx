import React, { useEffect, useState } from 'react'
import classses from './AllTime.module.css'
import OneTime from './OneTime'
import styled from 'styled-components'
import { useQuery } from 'react-query'


const FlexDiv = styled.div`
  width: 85%;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
`


function findClosestLargerNumber(target, numbers) {
  // Инициализируем переменную для хранения ближайшего большего числа
  let closestLargerNumber = Infinity;
  
  // Проходимся по всем числам из массива
  numbers.forEach(number => {
      // Если число больше целевого и меньше ближайшего большего числа, обновляем его
      if (number > target && number < closestLargerNumber) {
          closestLargerNumber = number;
        } 
        if(target > numbers[5]){
        closestLargerNumber = numbers[5]
      }
  });
  
  // Возвращаем найденное ближайшее большее число
  return closestLargerNumber;
}

const  AllTime= React.memo((props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(null) 
  // times
  const [fajr, setFajr] = useState('00:00') // 02:11
  const [sunrise, setSunrise] = useState('00:00') 
  const [dhuhr, setDhuhr] = useState('00:00')
  const [asr, setAsr] = useState('00:00') // 18:31
  const [maghrib, setMaghrib] = useState('00:00')
  const [isha, setIsha] = useState('00:00')


  const ErrorComp = ()=>{
    return (
      <h1>Error please try again or contact <a href="https://t.me/Bilol_8080">the administarator</a></h1>
    )
  }

  // useEffect(() => {
    const fetchData = async () => {
      try {
        const location = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')
        const jsonLocation = await location.json()
        const method = '2'
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${jsonLocation.countryName}&country=${jsonLocation.city}&method=${method}&school=1`);
        setCity(jsonLocation.city)
        const jsonData = await response.json();
        setData(jsonData.data.timings);
        console.log(jsonData.data.timings)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        <ErrorComp />
        }
      };
        
    const { error, isLoading} = useQuery('randomFacts', fetchData,{
      staleTime: 60000, // Время в миллисекундах, после которого данные считаются устаревшими (например, 1 минута)
      cacheTime: 300000, // Время в миллисекундах, в течение которого данные сохраняются в кэше (например, 5 минут)
    });
    if(error) (<ErrorComp />)

    useEffect(()=>{
      if(data){
        setFajr(data.Fajr) 
        setSunrise(data.Sunrise) 
        setDhuhr(data.Dhuhr) 
        setAsr(data.Asr)
        setMaghrib(data.Maghrib)
        setIsha(data.Isha)
      }
    },[data])





    function getMinuts(num){
      const [hoursSplit, minutes] = num.split(':'); //time.split(':')  
      return (parseInt(hoursSplit) * 60) + parseInt(minutes)
    }
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();


    
    const timeMoments = {
      fajr: getMinuts(fajr),
      sunrise: getMinuts(sunrise),
      dhuhr: getMinuts(dhuhr),
      asr: getMinuts(asr),
      maghrib: getMinuts(maghrib),
      isha: getMinuts(isha)
  };
  
  const closestTime = findClosestLargerNumber(currentTime, Object.values(timeMoments));
  
  let closestMoment;
  for (const [moment, time] of Object.entries(timeMoments)) {
      if (time === closestTime) {
          closestMoment = moment;
          break;
      }
  }


  const [nextTime, setNextTime] = useState('00:00')
  useEffect(()=>{
    if(closestMoment == 'fajr') setNextTime(fajr)
    if(closestMoment == 'sunrise') setNextTime(sunrise)
    if(closestMoment == 'dhuhr') setNextTime(dhuhr)
    if(closestMoment == 'asr') setNextTime(asr)
    if(closestMoment == 'maghrib') setNextTime(maghrib)
    if(closestMoment == 'isha') setNextTime(isha)
  },[closestTime])
  
  // console.log(closestMoment)

  return (
    <div className={`${classses.maindiv} ${loading && classses.loader}`}>
    {loading && isLoading ? (
      <>
      <div className="loader-div">
      <div className="loader"></div>
      </div>
      </>
    ) : (
      <>
      <h6 className='opacity-h6'>{city}</h6>
        <h1 className={classses.h1}>Prayer Time</h1>
        <div className={`${classses.maintime} next_time`}>
            <h3 className={classses.marginTopH3}>Next prayer time</h3>
            <OneTime 
                next={true}
                time={nextTime}
            >{closestMoment}</OneTime>
        </div>
        <h3>All times</h3>
        <FlexDiv>
          <OneTime time={fajr}>Fajr</OneTime>
          <OneTime time={sunrise}>Sunrise</OneTime>
          <OneTime time={dhuhr}>Dhuhr</OneTime>
        </FlexDiv>
        <FlexDiv>
          <OneTime time={asr}>Asr</OneTime>
          <OneTime time={maghrib}>Maghrib</OneTime>
          <OneTime time={isha}>Isha</OneTime>
        </FlexDiv>
      </>
      )}
      <h6 className='opacity-h6'><a style={{color: '#ffffff'}} href="https://github.com/bilol-anvarov" target='_blank'>Developed by A.B.A</a></h6>
    </div>
  )
})
export default AllTime