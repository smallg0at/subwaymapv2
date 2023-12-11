import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ycl.beijingsubwaymap',
  appName: '北京地铁图',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
};

export default config;
