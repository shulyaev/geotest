import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, FlatList, Dimensions, Alert, Image } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { TopicListRow, Tile } from './common';
import {scaleVertical} from '../scale';

const numColumns = 2;
let _this = null;

export default class TopicList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'גיאומטריקיט',
      headerRight: (
        <Icon
          style={{ paddingRight: 15, color: "#fff" }}
          onPress={() => navigation.navigate('HamburgerMenu', { onValueChange: ((filtered)=>{_this.setState({filtered});}).bind(_this),  updateSubjects: (()=>{_this.componentDidMount()}).bind(_this),value: (()=>{return _this.state.filtered}).bind(_this), groupID: _this.state.groupID})}
          name="md-menu"
          size={30}
        />
      ),  
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      groupID: '',
      subjects: [],
      filtered: false,
      loading: true,
    }
  }

  componentDidMount(){
    this.setState({loading: true});
    _this = this;
    AsyncStorage.getItem('userData').then((value) => {
      this.setState({groupID: JSON.parse(value).groupID });
      axios.get(`http://geometrikit-ws.cfapps.io/api/getsubjects?filtered=${this.state.filtered}&groupID=${this.state.groupID}`)
      .then((response) => {
        this.setState({subjects: response.data, loading: false})
      })
      .catch(() => {
        Alert.alert(
          '',
          "תקלה בחיבור לשרת, אנא נסה שוב מאוחר יותר",
          [
            {text: 'נסה שוב', onPress: () => this.componentDidMount()},
          ],
          {cancelable: false},);
      })
      .done();
    });
  }

  GetGridViewItem(item) {
    this.props.navigation.navigate('QuestionList', { subjectID: item.subjectID, subjectName: item.subjectName, color: item.color, groupID: this.state.groupID })
  }

  renderContent = () => {
    if (this.state.loading){
        return (
            <View style={{justifyContent: 'center', flex: 1}}>
                <ActivityIndicator size="large" color="#f44444" />
            </View>
        )
    } else {
        return (
          <FlatList
          data={this.state.subjects}
          style={styles.containerNew}
          renderItem={({ item }) =>
            <TouchableOpacity style={[styles.GridViewContainer, { backgroundColor: item.color }]} onPress={this.GetGridViewItem.bind(this, item)}>
              <Image source={{ uri: item.picture}} style={{ flex: 1.9, width: Dimensions.get('window').height / 7, margin: 5 }}/>
              <Text style={styles.GridViewTextLayout}> {item.subjectName} </Text>
            </TouchableOpacity>}
          numColumns={numColumns}
          keyExtractor={(item, index) => index.toString()}
          />
        )
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerNew: {
    flex: 1,
  },
  itemText: {
    color: '#fff',
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 4.3,
    margin: 5
  },
  GridViewTextLayout: {
    fontSize: scaleVertical(2.3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    padding: 3,
    flex:1
  }
});
