module.exports = {
    packagerConfig: {
      icon: './src/assets/icon', // 앱 아이콘 경로 설정 (확장자 .ico/.icns)
    },
    rebuildConfig: {},
    makers: [
      {
        name: '@electron-forge/maker-squirrel',
        config: {
          name: 'clatalk',
          setupIcon: './src/assets/icon.ico', // 설치 아이콘 경로 설정
          authors: 'Junyoung Oh', 
          description: 'Chat Overlay application for Windows', 
       
        },
      },
      {
        name: '@electron-forge/maker-zip',
        platforms: ['darwin'],
      },
      {
        name: '@electron-forge/maker-deb',
        config: {},
      },
      {
        name: '@electron-forge/maker-rpm',
        config: {},
      },
    ],
  };
  