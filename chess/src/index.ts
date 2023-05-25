import App, {IAppConfig} from './app';
import ChessPortalController from './chess-portal/controller';

const appConfig: IAppConfig = {
  corsOrigin: '*',
}
const app = new App(appConfig);
app.initController(ChessPortalController)
app.listen(8002);