import App, { IAppConfig } from './app';
import ChatPortalController from './chat-portal/controller';

const config: IAppConfig = {
  corsOrigin: '*'
}

const chatApp = new App(config);
chatApp.initController(ChatPortalController);
chatApp.listen(process.env.PORT ? +process.env.PORT : 8001);