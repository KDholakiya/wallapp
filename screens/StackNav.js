import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import { 
  createStackNavigator
} from 'react-navigation';
import ContentX from './contentX'

class StackNav extends React.Component {
  render() {
    return (
        <Router/>
    );
  }
}
var Router = createStackNavigator ({
  Home: props => <HomeScreen {...props} query="Home" /> ,
  Backgrounds: {
    screen: props => <ContentX {...props} query="Backgrounds" />
  },
  Religion: {
    screen: props => <ContentX {...props} query="Religion" />
  },
  Nature: {  
    screen: props => <ContentX {...props} query="Nature" />
  },
  Fashion: {
    screen: props => <ContentX {...props} query="Fashion" />
  },
  Places: {
    screen: props => <ContentX {...props} query="Places" />
  },
  Animals: {
    screen: props => <ContentX {...props} query="Animals" />
  },
  Music: {
    screen: props => <ContentX {...props} query="Music" />
  },
  Transportation: {
    screen: props => <ContentX {...props} query="Transportation" />
  },
  Buildings: {
    screen: props => <ContentX {...props} query="Buildings" />
  },
  Travel: {
    screen: props => <ContentX {...props} query="Travel" />
  },
  Science: {
    screen: props => <ContentX {...props} query="Science" />
  },
  Education: {
    screen: props => <ContentX {...props} query="Education" />
  },
  People: {
    screen: props => <ContentX {...props} query="People" />
  },
  Feelings: {
    screen: props => <ContentX {...props} query="Feelings" />
  },
  
  Health: {
    screen: props => <ContentX {...props} query="Health" />
  },
  
  Industry: {
    screen: props => <ContentX {...props} query="Industry" />
  },
  Food: {
    screen: props => <ContentX {...props} query="Food" />
  },
  Computer: {
    screen: props => <ContentX {...props} query="Computer" />
  },
  Sports: {
    screen: props => <ContentX {...props} query="Sports" />
  },
  
  Business: {
    screen: props => <ContentX {...props} query="Business" />
  },
  
},{
   initialRouteName: "Home",
   navigationOptions: {

        header: null

      }
})


export default StackNav;