import React, { useState, useEffect } from 'react'

const Tooltip = ({ title, children }) => {
    const [show, setShow] = useState(false)
    
    return (
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <div className={show ? 'tooltip show' : 'tooltip'}>{title}</div>
            {children}
        </div>
    )
}

export default Tooltip
