Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1
    var dd = this.getDate()
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-')
}

browser.windows.onCreated.addListener(window => {
    browser.storage.local.set({ activeSite: {} })
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.status === 'complete') {
        setActive(tab.url)
    }
})

browser.tabs.onActivated.addListener(activeInfo => {
    browser.tabs.get(activeInfo.tabId, tab => {
        setActive(tab.url)
    })
})

const setActive = (url) => {
    browser.storage.local.get(['activeSite'], ({ activeSite }) => {
        stopTimer(activeSite)
        
        try {
            const { hostname } = new URL(url)
            const activeSite = { host: hostname, startTime: new Date().getTime() }
            browser.storage.local.set({ activeSite })
        } catch (e) {
            //error
            browser.storage.local.set({ activeSite: {} })
        }
        
    })
}

const stopTimer = (activeSite) => {
    if (activeSite && Object.keys(activeSite).length !== 0) {
        browser.storage.local.get(['storeSites'], ({ storeSites }) => {
            let index = -1
            if (storeSites) {
                index = storeSites.findIndex(obj => obj.date === new Date().yyyymmdd())
            } else {
                storeSites = []
            }
            if (index === -1) {
                storeSites.push({ date: new Date().yyyymmdd(), sites: [] })
                index = storeSites.length - 1
            }
            
            let k = storeSites[index].sites.findIndex(obj => obj.host === activeSite.host)
            if (k === -1)
                storeSites[index].sites.push({ host: activeSite.host, timer: (new Date().getTime() - activeSite.startTime) / 1000 })
            else
                storeSites[index].sites[k].timer += (new Date().getTime() - activeSite.startTime) / 1000
            
            browser.storage.local.set({ storeSites }, () => console.log(storeSites))
        })
    }
}

browser.windows.onRemoved.addListener(windowId => {
    browser.storage.local.get(['activeSite'], ({ activeSite }) => {
        stopTimer(activeSite)
    })
})
