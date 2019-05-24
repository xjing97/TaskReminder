import React, { Component, PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  AppState,
} from 'react-native';
import {
  AppButton,
} from './UI';
import { FloatingAction } from 'react-native-floating-action';

let config=require('./Config');

const actions = [{
  text: 'Add',
  icon: require('./images/baseline_add_white_18dp.png'),
  name: 'add',
  position: 1
}];


let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class ViewTask extends Component {
  static navigationOptions = {
    title: 'My Task',
  };

  constructor(props) {
    super(props)

    this.state = {
      tasks: [],
    };

    this._load = this._load.bind(this);
    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase({
      name: 'taskdb',
      createFromLocation : '~reminder.sqlite'
    }, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._load();
    this._query();
  }

  _query(){

    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM taskReminder ORDER BY date', [], (tx, results) => {
        this.setState({
          tasks: results.rows.raw(),
        })
      })
    });

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
     })
     .catch((error) => {
       console.error(error);
     });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={ this.state.tasks }
          extraData={this.state}
          showsVerticalScrollIndicator={ true }

          renderItem={({item}) =>
          <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={ () => {
                this.props.navigation.navigate('viewD', {
                  id: item.id,
                  headerTitle: item.name,
                  refresh: this._load,
                })
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{ item.task }</Text>
                <Text style={styles.itemSubtitle}>{ item.dateText }</Text>

              </View>
              </TouchableHighlight>

            }

             keyExtractor={(item) => {item.id.toString()}}
        />

        <AppButton style={styles.button}
          title={'View my Calendar'}
          theme={'primary'}
          onPress={
            () => {
              this.props.navigation.navigate('Calendar',{
                refresh:this._load,
              })
            }
          }
        />

        <FloatingAction
          actions={actions}
          overrideWithAction={true}
          color={'#a80000'}
          onPressItem={
            () => {
              this.props.navigation.navigate('add', {
                refresh: this._load,
              })
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
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
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
