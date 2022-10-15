import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import duration from 'dayjs/plugin/duration'

dayjs.locale('ru')
dayjs.extend(duration)

const TimeView = ({ duration, startTime }) => {
    const allduration = duration + (startTime ? (dayjs().valueOf() - startTime) / 1000 : 0)
    const dur = dayjs.duration(allduration, 's')
    const hours = dur.hours() + 24 * dur.days()

    const [time, setTime] = useState(dur)

    useEffect(() => {
        setTime(dur)
        if (startTime) {
            const timer = setInterval(() => {
                setTime(t => t.add(1, 's'))
            }, 1000)
        
            return () => clearInterval(timer)
        }
    }, [allduration])

    return (
        <div className="time">
            {allduration > 0 && <div>{(hours < 10 ? '0' + hours : hours) + time.format(':mm:ss')}</div>}
        </div>
    )
}

export default TimeView
