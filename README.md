# aoe4-guides-api
This service provides a public REST api to access Age of Empires 4 build orders from aoe4guides.com

## Supported Civilizations
The API supports all Age of Empires IV civilizations including:
- **Base Game**: English (ENG), French (FRE), Rus (RUS), Malians (MAL), Delhi Sultanate (DEL), Holy Roman Empire (HRE), Abbasid Dynasty (ABB), Ottomans (OTT), Chinese (CHI), Mongols (MON)
- **The Sultans Ascend DLC**: Byzantines (BYZ), Japanese (JAP), Ayyubids (AYY), Jeanne d'Arc (JDA), Zhu Xi's Legacy (ZXL), Order of the Dragon (DRA)
- **The Knights of the Cross and Crescent DLC**: House of Lancaster (HOL), Knights Templar (KTE)
- **The Dynasties of the East DLC**: Golden Horde (GOH), Sengoku Daimyo (SEN), Macedonian Dynasty (MAC), Tughlaq Dynasty (TUG)

## API Documentation 
https://aoe4guides.com/api/api-docs/

### Quick Start
```bash
# Get latest 10 builds
GET https://aoe4guides.com/api/builds

# Get builds for a specific civilization (e.g., English)
GET https://aoe4guides.com/api/builds?civ=ENG

# Get builds by author
GET https://aoe4guides.com/api/builds?author=USER_ID

# Get a specific build
GET https://aoe4guides.com/api/builds/BUILD_ID

# Get overlay format for build order tools
GET https://aoe4guides.com/api/builds/BUILD_ID?overlay=true
```

![image](https://github.com/jensbuehl/aoe4-guides-api/assets/3983913/fc0df529-6a6c-428c-b66c-9911c73d4106)


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Features

- ✅ REST API endpoints for build orders
- ✅ Support for all AoE4 civilizations (24 total)
- ✅ Filtering by civilization and author
- ✅ Sorting by score, creation time, views, likes
- ✅ Overlay format support for build order tools
- ✅ User favorites system
- ✅ Swagger/OpenAPI documentation
- ✅ CORS enabled for web applications

## Project Setup

```sh
npm install
```

### Start server for development

```sh
npm start
```

The server will start on port 8080 by default, or use the PORT environment variable.

## License

The project is licensed under MIT.

## Disclaimer

Age of Empires IV © Microsoft Corporation.

This project was created under Microsoft's ["Game Content Usage Rules"](https://www.xbox.com/en-US/developers/rules) using assets from Age of Empires IV, and it is not endorsed by or affiliated with Microsoft.

