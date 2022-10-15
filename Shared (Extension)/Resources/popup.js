import React, { useEffect, useState } from 'react'
import { render, createRoot } from 'react-dom'

import TimeView from './components/TimeView'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

const App = () => {
    const [date, setDate] = useState(dayjs())
    const [store, setStore] = useState([])
    const [active, setActive] = useState(null)
    
    useEffect(() => {
        browser.storage.local.get(['storeSites', 'activeSite'], ({ storeSites, activeSite }) => {
            if (activeSite && Object.keys(activeSite).length !== 0) {
                setActive(activeSite)
                if (!storeSites[storeSites.length - 1].sites.some(s => s.host === activeSite.host))
                    storeSites[storeSites.length - 1].sites.push({ host: activeSite.host, timer: 0 })
            }
            setStore(storeSites)
        })
    }, [])
    
    return (
        <>
            {store.map(s => (
                <>
                    <div>{dayjs(s.date).format('D MMM')}</div>
                    {s.sites.map(site => (
                        <>
                            <div>{site.host}</div>
                            <TimeView duration={site.timer} startTime={dayjs().format('YYYY-MM-DD') === s.date && active && active.host === site.host ? active.startTime : null} />
                        </>
                    ))}
                </>
            ))}
        </>
    )
}

createRoot(document.getElementById('timer')).render(<App />)
