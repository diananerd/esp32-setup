# Ground Station Firmware Uploader
This is the firmware uploader for the PlatziSat-1 Ground Station.
It is built using Vue + Vite + Electron.

See the oficial build at [Platzi Space Program Site](https://platzi.com/space/). Need a Platzi account to access to the full site and the ground station control panel.

## Install dependencies
```sh
npm install
```

> [!IMPORTANT]
> For security reasons, electron not allowed to use serial communication in development mode, so you need to run a production build to test the app. If you run this project in developer mode, simply fails.

### Compile and run a production build
```sh
npm run build
npm run electron:start
```

### Lint with [ESLint](https://eslint.org/)
```sh
npm run lint
```

## Credits
Software and Tools by [Diana Nerd](https://github.com/diananerd).</br>
Built for the Platzi Space Program by [Platzi](https://platzi.com/).