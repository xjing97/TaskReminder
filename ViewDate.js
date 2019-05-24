import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
} from 'react-native';
import {
  InputWithLabel
} from './UI';


let config = require('./Config');

type Props = {};
export default class ViewDate extends Component<Props> {
static navigationOptions = {
    title: 'Date Detail',
  };

  constructor(props) {
    super(props)

    this.state = {
      dateText: this.props.navigation.getParam('dateText'),
      tasks: [],
    };

    this._load = this._load.bind(this);
  }

  componentDidMount() {
    this._load();
  }

  _load() {

    let url = config.settings.serverPath + '/api/taskReminder/' + this.state.dateText;

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

  render() {

    return (
      <View style={styles.container}>

      <Text style={styles.itemTitle}>{this.state.dateText}</Text>
      <FlatList
        data={ this.state.tasks }
        extraData={this.state}
        showsVerticalScrollIndicator={ true }

        renderItem={({item}) =>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{ item.timeText }</Text>
          <Text style={styles.itemSubtitle}>{ item.task }</Text>

        </View>
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
 item: {
   justifyContent: 'center',
   paddingTop: 10,
   paddingBottom: 10,
   paddingLeft: 25,
   paddingRight: 25,
   borderBottomWidth: 1,
   borderColor: '#ccc',
 },
 itemTitle: {
   fontSize: 22,
   fontWeight: '500',
   color: '#000',

 },
 itemSubtitle: {
   fontSize: 18,
 }
});
