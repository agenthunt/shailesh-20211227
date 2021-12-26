import {AppRegistry} from 'react-native';
import {AppWithProvider} from './AppWithProvider';

AppRegistry.registerComponent('TheOrderbook', () => AppWithProvider);
AppRegistry.runApplication('TheOrderbook', {
  rootTag: document.getElementById('root'),
});
