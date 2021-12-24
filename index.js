/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {AppWithProvider} from './AppWithProvider';

AppRegistry.registerComponent(appName, () => AppWithProvider);
