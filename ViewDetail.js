import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
  text: 'Edit',
  color: '#c80000',
  icon: require('./images/baseline_edit_white_18dp.png'),
  name: 'edit',
  position: 2
},{
  text: 'Delete',
  color: '#c80000',
  icon: require('./images/baseline_delete_white_18dp.png'),
  name: 'delete',
  position: 1
}];

let config = require('./Config');

type Props = {};
export default class ViewDetail extends Component<Props> {
static navigationOptions = {
    title: 'Task Detail',
  };

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.navigation.getParam('id'),
      tasks: null,
    };

    this._load = this._load.bind(this);
    this._delete = this._delete.bind(this);
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
      this.setState({tasks});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.tasks.task +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          let url = config.settings.serverPath + '/api/taskReminder/' + this.state.id;

          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.id,
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
            if(responseJson.affected == 0) {
              Alert.alert('Error deleting record');
            }

            this.props.navigation.getParam('refresh')();
            this.props.navigation.goBack();
          })
          .catch((error) => {
            console.error(error);
          });
        },
      },
    ], { cancelable: false });
  }

  render() {
    let tasks = this.state.tasks;

    return (
      <View style={styles.container}>
        <ScrollView>
          <InputWithLabel style={styles.output}
            label={'Task'}
            value={tasks ? tasks.task : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Date'}
            value={tasks ? tasks.dateText : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Time'}
            value={tasks ? tasks.timeText : ''}
            orientation={'vertical'}
            editable={false}
          />

        </ScrollView>

        <FloatingAction
          actions={actions}
          color={'#a80000'}
          floatingIcon={(
            <Image
              source={require('./images/baseline_edit_white_18dp.png')}
            />
          )}
          onPressItem={(name) => {
              switch(name) {
                case 'edit':
                  this.props.navigation.navigate('update', {
                  id: tasks ? tasks.id : 0,
                  refresh: this._load,
                  indexRefresh: this.props.navigation.getParam('refresh'),

                  });
                  break;

                case 'delete':
                  this._delete();
                  break;
              }

            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
   fontSize: 16,
   color: '#000099',
   marginTop: 10,
   marginBottom: 10,
 },
});
