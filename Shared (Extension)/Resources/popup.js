import React, { useEffect, useState } from 'react'
import { render, createRoot } from 'react-dom'

import TimeView from './components/TimeView'
import ToggleButton from './components/ToggleButton'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

const App = () => {
    const [date, setDate] = useState(dayjs())
    const [store, setStore] = useState([])
    const [active, setActive] = useState(null)
    const [showPercent, setShowPercent] = useState(true)
    
    useEffect(() => {
        browser.storage.local.get(['storeSites', 'activeSite'], ({ storeSites, activeSite }) => {
            if (activeSite && Object.keys(activeSite).length !== 0) {
                setActive(activeSite)
                if (storeSites[storeSites.length - 1].date !== dayjs().format('YYYY-MM-DD'))
                    storeSites.push({ date: dayjs().format('YYYY-MM-DD'), sites: [] })
                if (!storeSites[storeSites.length - 1].sites.some(s => s.host === activeSite.host))
                    storeSites[storeSites.length - 1].sites.push({ host: activeSite.host, timer: 0 })
            }
            setStore(storeSites.map(s => ({...s, totalTime: s.sites.reduce((r, i) => r + i.timer, 0)})))
        })
    }, [])
    
    const handleToggle = () => {
        setShowPercent(!showPercent)
    }
    
    return (
        <>
            <ToggleButton showPercent={showPercent} onClick={handleToggle} />
            {store.map(s => (
                <>
                    <div className="date">{dayjs(s.date).format('D MMM')}</div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(' + s.sites.length + ', minmax(100px, 1fr))' }}>
                        {s.sites.map(site => (
                            <div>
                                <div>{site.host}</div>
                                {showPercent ?
                                    <div>{(site.timer/s.totalTime*100).toFixed(0) + '%'}</div> :
                                    <TimeView duration={site.timer} startTime={dayjs().format('YYYY-MM-DD') === s.date && active && active.host === site.host ? active.startTime : null} />
                                }
                            </div>
                        ))}
                    </div>
                </>
            ))}
        </>
    )
}

createRoot(document.getElementById('timer')).render(<App />)
