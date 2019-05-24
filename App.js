import {
  createStackNavigator,
} from 'react-navigation';
import CalendarScreen from './CalendarScreen';
import AddTask from './AddTask';
import ViewTask from './ViewTask';
import UpdateTask from './UpdateTask';
import ViewDetail from './ViewDetail';
import ViewDate from './ViewDate';

export default createStackNavigator({
  Calendar: {
    screen: CalendarScreen,
  },
  add: {
    screen: AddTask,
  },
  view: {
    screen: ViewTask,
  },
  viewD: {
    screen: ViewDetail,
  },
  update: {
    screen: UpdateTask,
  },
  viewDate:{
    screen: ViewDate,
  },
}, {
  initialRouteName: 'view',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
