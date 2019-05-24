import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI';

let config = require('./Config');

type Props = {};
export default class UpdateTask extends Component<Props> {
static navigationOptions = {
    title: 'Edit Task',
  };

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.navigation.getParam('id'),
      task: '',
      dateText: '',
      timeText: '',

    };

    this._load = this._load.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this._load();
  }

  _load() {
    let url = config.settings.serverPath + '/api/taskReminder/' + this.state.id;

    fetch(url)
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((tasks) => {
      this.setState({
        task: tasks.task,
        dateText: tasks.dateText,
        timeText: tasks.timeText,
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _update() {
    let url = config.settings.serverPath + '/api/taskReminder/' + this.state.id;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        task: this.state.task,
        dateText: this.state.dateText,
        timeText: this.state.timeText,
      }),
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((responseJson) => {
      if(responseJson.affected > 0) {
        Alert.alert('Record Updated', 'Record for `' + this.state.task + '` has been updated');
      }
      else {
        Alert.alert('Error updating record');
      }

      this.props.navigation.getParam('refresh')();
      this.props.navigation.getParam('indexRefresh')();
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error(error);
    });
  }

  openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2099, 11, 31),
        mode: 'calendar', // try also with `spinner`
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);

        this.setState({
          date: selectedDate,
          dateText: selectedDate.formatted(),
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

openTimePicker = async () => {
 try {
    const {action, hour, minute} = await TimePickerAndroid.open({
      hour: this.state.hour,
      minute: this.state.minute,
      is24Hour: true,
      mode: 'clock',  // try also with `spinner`
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      // Selected hour (0-23), minute (0-59)
      this.setState({
        hour: hour,
        minute: minute,
        timeText: `${hour>9 ? hour : '0'+hour}:${minute>9 ? minute : '0'+minute}`,
      });
    }
  } catch ({code, message}) {
    console.warn('Cannot open time picker', message);
  }
}

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={(task) => this.setState({task})}
          value={this.state.task}
          placeholder='Task Title'
          underlineColorAndroid={'transparent'}
        />
        <TouchableWithoutFeedback
          onPress={ this.openDatePicker }
        >
          <View>
            <TextInput
              style={styles.input}
              value={this.state.dateText}
              placeholder={this.state.dateText}
              editable={false}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={ this.openTimePicker }
        >
          <View>
            <TextInput
              style={styles.input}
              value={this.state.timeText}
              placeholder='Event Time'
              editable={false}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </TouchableWithoutFeedback>
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
        />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    fontSize: 20,
    height: 48,
    color: 'black',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  button: {
  marginTop: 10,
  marginBottom: 10,
},
});
