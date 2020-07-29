import React from "react";
import { 
  StatusBar,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Heading from "./../components/heading"

let DIM = Dimensions.get('window')
const categories = [
  "backgrounds",
  "religion",
  "nature",
  "animals",
  "places",
  "science",
  "people",
  "feelings",
  "transportation",
  "travel",
  "industry",
  "food",
  "computer",
  "sports",
  "buildings",
  "business",
  "music",
  "education",
  "health",
  "fashion",
]


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {};
  }
  renderCategories = () =>{
    let cats=[]
    categories.map(function(elem, index) {
      cats.push(
        <TouchableWithoutFeedback key={index} onPress={()=>{this.route(elem)}} >
          <View style={{width:DIM.width - 20,height:(DIM.height/5)-10,backgroundColor:"#343944",borderWidth:1,borderColor:'#ffc080',marginBottom:15,borderRadius:4,elevation:10,justifyContent:'center',alignItems:'center'}}>
          <Text  style={{color:"#ffc080",fontSize:30,letterSpacing:5,fontWeight:'normal'}}>
            {this.capFirstChar(elem)}
          </Text>
        </View>
        </TouchableWithoutFeedback>
        
      )
    },this)
   return cats
  }
  route = (elem) =>{
    this.props.navigation.navigate(this.capFirstChar(elem))
  }
  capFirstChar=(string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 
  render() {
    return (
     <View style={{flex:10}}>
       <StatusBar backgroundColor={'#343944'}/>
        <View style={{flex:1}}>
          <Heading title={this.props.query}/>
        </View>
        <View style={{flex:10,backgroundColor:'#343944'}}>
          <ScrollView>
            <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:15}}>
              {this.renderCategories()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}