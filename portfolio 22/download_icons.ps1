$icons = @{
    'html'          = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/html5.svg'
    'css'           = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/css.svg'
    'javascript'    = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg'
    'react'         = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg'
    'react-native'  = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg'
    'tailwind'      = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tailwindcss.svg'
    'gsap'          = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/greensock.svg'
    'framer-motion' = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/framer.svg'
    'locomotive'    = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/npm.svg'
    'nodejs'        = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg'
    'express'       = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/express.svg'
    'mongodb'       = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mongodb.svg'
    'mongoose'      = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mongoose.svg'
    'ejs'           = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/ejs.svg'
    'rest-api'      = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/fastapi.svg'
    'java'          = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openjdk.svg'
    'xml'           = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/html5.svg'
    'firebase'      = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/firebase.svg'
    'git'           = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/git.svg'
    'github'        = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg'
    'postman'       = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/postman.svg'
    'vite'          = 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg'
}

foreach ($key in $icons.Keys) {
    $url = $icons[$key]
    $outFile = "images/icons/$key.svg"
    Write-Host "Downloading $key to $outFile..."
    curl.exe -s -L $url -o $outFile
}
