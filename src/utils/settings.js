const SETTINGS = {
    apiAddress: 'https://hk.infnote.com',
    chainAddress: 'https://hk.infnote.com',
    languagesList: ['English','Simplified Chinese'],
    defaultLanguage: 'en-US',
    chains: [
        // "19AZfrNgBh5sxo5eVytX3K3yQvucS5vc45", // for testing
        // "15mhzB7c6rbDrSPimePU9zWMo3US9sAZzL" // for testing
        "1BWJrzQBjWJ1JTBRXYrWRAU9dYdJJ2GXDM", 
        "1PdJ5CLZfqUKy39RBfSPcwGnXvbdFgBuEW"
    ],
    peers: [
        //"ws://10.89.58.116:32767" //, "ws://10.89.58.116:32769"
        "ws://hk.infnote.com:32767"
    ]
}

export default SETTINGS