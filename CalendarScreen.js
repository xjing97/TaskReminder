import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import addTask from './addTask';
import { FloatingAction } from 'react-native-floating-action';


const actionsNew = [{
  text: 'View',
  icon: require('./images/view.png'),
  name: 'view',
  position: 2
}];

let SQLite = require('react-native-sqlite-storage');

let config = require('./Config');

export default class CalendarScreen extends Component {
  static navigationOptions = {
      title: 'Task Reminder',
    };
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      dates: {},
      selected:'',
    }
    this._load = this._load.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  componentDidMount() {
    this._load();
  }

  componentWillMount(){
    this._load();
  }

  _load() {
     let url = config.settings.serverPath + '/api/taskReminder';

     fetch(url)
     .then((response) => {
       if(!response.ok) {
         Alert.alert('Error', response.status.toString());
         throw Error('Error ' + response.status);
       }

       return response.json()
     })
     .then((tasks) => {
       this.setState({tasks});
       this.state.tasks.forEach((val) => {
         this.state.dates[val.dateText] = {selected: true};

       });
     })
     .catch((error) => {
       console.error(error);
     });
   }


  onDayPress(day) {
    this.setState({
      selected: day.dateString,

    });

    this.props.navigation.navigate('viewDate', {
      dateText: day.dateString,
     })
  }
  _onPressBack(){
    const {goBack} = this.props.navigation


      goBack()

  }

  render() {

    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>

        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={this.state.dates}
          theme={{
            selectedDayBackgroundColor: 'green',
            todayTextColor: 'red',
            arrowColor: 'green',
          }}
        />



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350,

  }
});
