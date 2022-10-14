import React, { useEffect } from 'react'
import { render, createRoot } from 'react-dom'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

const App = () => {
    
    
    return (
        <div>Hello world</div>
    )
}

createRoot(document.getElementById('timer')).render(<App />)
