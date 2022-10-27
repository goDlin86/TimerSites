import React, { useEffect, useState } from 'react'
import { render, createRoot } from 'react-dom'

import TimeView from './components/TimeView'
import ToggleButton from './components/ToggleButton'
import Tooltip from './components/Tooltip'

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
            setStore(
                storeSites
                     .reverse()
                     .map(s => ({ ...s, totalTime: s.sites.reduce((r, i) => r + i.timer, 0) }))
                     .map(s => ({ ...s, sites: s.sites.sort((a, b) => b.timer - a.timer) }))
            )
        })
    }, [])
    
    const handleToggle = () => {
        setShowPercent(!showPercent)
    }
    
    return (
        <>
            <ToggleButton showPercent={showPercent} onClick={handleToggle} />
            {store.slice(0, 7).map(s => (
                <>
                    <div className="date">{dayjs(s.date).format('dddd, D MMM')}</div>
                    <div className="grid" style={{ gridTemplateColumns: s.sites.map(site => (site.timer/s.totalTime*100).toFixed(0) + 'fr').join(' ') }}>
                        {s.sites.map(site => (
                            <Tooltip title={site.host}>
                                {showPercent ?
                                    <div>{(site.timer/s.totalTime*100).toFixed(0) + '%'}</div> :
                                    <TimeView duration={site.timer} startTime={dayjs().format('YYYY-MM-DD') === s.date && active && active.host === site.host ? active.startTime : null} />
                                }
                            </Tooltip>
                        ))}
                    </div>
                </>
            ))}
        </>
    )
}

createRoot(document.getElementById('timer')).render(<App />)
