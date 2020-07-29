import React from 'react';
import { 
   YellowBox,
   NetInfo ,
   StatusBar
} from 'react-native';
import { 
  createBottomTabNavigator
} from 'react-navigation';
import { Icon } from 'native-base';
import StackNav from "./screens/StackNav"
import Profile from "./screens/Profile"
import Search from "./screens/Search"
import Favs from "./screens/Favs"
import OfflineNotice from './components/OfflineNotice'
import SplashScreen from 'react-native-splash-screen'



YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  'Setting a timer',
  '@setting/database'
]);

class Wallapp extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isConnected: true
    };
  }
  componentDidMount() {
    SplashScreen.hide();
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  render() {
    StatusBar.setBackgroundColor('#343944');
    if (!this.state.isConnected) {
      return <OfflineNotice />;
    }
    return (
        <HomeScreenRouter/>
    );
  }
}

const HomeScreenRouter = createBottomTabNavigator({
    Home: { screen: StackNav ,
          navigationOptions:{
            tabBarLabel:'Hom3',
            tabBarIcon : ({tintColor}) =>(
              <Icon name="ios-home" size={24} style={{color:tintColor}}/>
            )
          }
        },
    Search: { screen: Search ,
          navigationOptions:{
            tabBarLabel:'search',
            tabBarIcon : ({tintColor}) =>(
              <Icon name="ios-search" size={24} style={{color:tintColor}}/>
            )
          }
        },
    Favs: { screen: Favs ,
          navigationOptions:{
              tabBarLabel:'Favs',
              tabBarIcon : ({tintColor}) =>(
                <Icon name="ios-heart" size={24} style={{color:tintColor}}/>
              )
          } 
        },
    Profile: { screen: Profile ,
            navigationOptions:{
              tabBarLabel:'Profile',
                  tabBarIcon : ({tintColor}) =>(
                  <Icon name="ios-settings" size={24} style={{color:tintColor}}/>
              )
            }
          }
},{
    swipeEnabled: true,
    initialRouteName:'Home',
    tabBarOptions:{
        showLabel:false,
        activeTintColor:'#ffc080',
        inactiveTintColor:'#C1C8D1',
        style: {
            backgroundColor: '#343944',
            elevation: 10,
            borderTopWidth: 1
        }
    }
});


export default Wallapp