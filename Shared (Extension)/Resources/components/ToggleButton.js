import React, { useState, useEffect } from 'react'

const ToggleButton = ({ showPercent, onClick }) => {
    return (
        <div className="toggle" onClick={onClick}>
            <div className={showPercent ? "active percent" : "active"} />
            <div>%</div>
            <div>Dur</div>
        </div>
    )
}

export default ToggleButton
