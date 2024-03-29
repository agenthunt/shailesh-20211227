/**
 * @format
 */
import 'intl';
import 'intl/locale-data/jsonp/en';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {AppWithProvider} from './src/AppWithProvider';

AppRegistry.registerComponent(appName, () => AppWithProvider);
