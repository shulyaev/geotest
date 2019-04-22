import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, Image, Alert, Dimensions, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import Icon1 from '@expo/vector-icons/Ionicons';
import { Button, Input } from './common';
import { ImagePicker, Permissions } from 'expo';
import axios from 'axios';
import MyCheckBox from './common/MyCheckBox';


let _this = null;

export default class AssignQuestionToClass extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'בחר כיתות לשיוך',
            headerRight: (
                <Icon1
                    style={{ paddingRight: 15, color: "#fff" }}
                    onPress={() => navigation.goBack()}
                    name="ios-arrow-forward"
                    size={30}
                />
            ),
            headerLeft: (
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {_this.saveAssignment();navigation.navigate('HamburgerMenu')}}>
                    <Text style={{paddingLeft: 15, color: '#fff', paddingTop: 17, fontSize: 25}}>
                        סיום
                    </Text>
                    <Icon1
                        style={{ paddingLeft: 10, paddingBottom: 53, color: "#fff" }}
                        name="ios-checkmark"
                        size={53}
                    />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedClasses : [],
            allClasses: [{classID: '1', grade: 'ט', classNum: '4', schoolName: 'םןו', assigned: false},
                        {classID: '2', grade: 'י', classNum: '5', schoolName: 'לחי', assigned: true},
                        {classID: '3', grade: 'יא', classNum: '6', schoolName: 'מנה', assigned: false}]
        }
    }

    componentDidMount () {
        // axios.get(`http://geometrikit-ws.cfapps.io/api/getallsubjects`)
        // .then((response) => {
        //   this.setState({allSubjects: response.data})
        // })
        // .done();
        this.state.allClasses.forEach(element => {
            if (element.assigned){
              this.state.selectedClasses.push(element.classID);
            }    
          });
        _this = this;
    }

    updateSelectedClasses = (classID) => {
        if (this.state.selectedClasses.includes(classID)){
          for( var i = 0; i < this.state.selectedClasses.length; i++){ 
            if ( this.state.selectedClasses[i] === classID) {
              this.state.selectedClasses.splice(i, 1); 
              break;
            }
          }
        } else {
          this.state.selectedClasses.push(classID);
        }
      }

    saveAssignment(){
        //save to DB function
    }

    render() {
        return (
            <ScrollView>
                 {this.state.allClasses.map(c =>
                    <MyCheckBox
                        key={c.classID}
                        classID={c.classID}
                        grade={c.grade}
                        classNum={c.classNum}
                        schoolName={c.schoolName}
                        checked={c.assigned}
                        updateSelectedClasses={this.updateSelectedClasses}
                    />
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});