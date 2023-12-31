export const environment = {
  production: true,
  BASE_URL: 'http://localhost:4200',
  websocket_url: 'ws://172.16.2.171:9001/hello',
  apiGatewayUrl: 'http://172.16.2.171:8000',
  notificationDuration: 3000,
  timerInterval: 6000,
  timerThreatConfigInterval: 60000,
  // notificationDuration: 1000,
  // timerInterval: 1000,
  // timerThreatConfigInterval: 2000,
  expiryDays: 1,
  languagesSupported: ['en-US', 'en-US-hexwave', 'fr-FR', 'es-ES', 'de'],
  reportChartSliderInterval: 30000,
  keycloakUrl: '/auth/realms/OauthToken/protocol/openid-connect',
  grantType: 'password',
  tokenVerifyClientId: 'ams-token-service',
  // tokenVerifySecret: '37834659-97e4-4e08-aca8-2343f2c293b5',
  tokenVerifySecret: '**********',
  isMobile: false,
  stopThreatUpdate: true,
  threatMessageUrl: 'http://172.16.2.171:8123',
  stopCallInterval: 5000,
  threatNotificationPopupInterval: 600000,
  tabletMacAdddress: '2e:8b:7d:95:d9:e2',
  avtarImage: 'tsa',
  labels: 'tsa'
};
