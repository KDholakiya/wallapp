import React from "react"
import { 
  View,
  Text,
  StyleSheet,
  Switch,
  Picker,
  FlatList,
  TouchableOpacity
} from "react-native";
import Heading from "./../components/heading"
import { 
	Input,
	Icon,
	Item
} from 'native-base';
import { RaisedTextButton } from 'react-native-material-buttons';
import ContentX from "./contentX"
import { createStackNavigator } from 'react-navigation';

const trends = [
	{key:'Universe'},
	{key:'India'},
	{key:'Religion'},
	{key:'Culture'},
	{key:'Fire'},
	{key:'Ice'}
]

class Search extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	query:"",
	  	selectedOrientation: "Vertical",
	  	selectedImageType:"All",
	  	safeSearch:true,
	  	editorsChoice:false
	  };
	
	}
	onOrientationChange(value) {
	    this.setState({
	      selectedOrientation: value
	    });
	}
	onImageTypeChange(value) {
	    this.setState({
	      selectedImageType: value
	    });
	}
	toggleSwitch = (value) => {
		if(value == "ss") this.setState({safeSearch: !this.state.safeSearch})
		else if(value == "ec") this.setState({editorsChoice: !this.state.editorsChoice})
    }
	fireQuery = (query="") =>{
		if(query == "") query = this.state.query
		if(query == "") return
		filters = {
			orientation:this.state.selectedOrientation,
          	safesearch:this.state.safeSearch,
          	editors_choice:this.state.editorsChoice,
          	image_type:this.state.selectedImageType,
          	per_page:20
		}
		this.props.navigation.navigate("Result", {
          	query: query,
          	filters:filters
          }
        )
	}
	trendSearch=(trend)=>{
		this.fireQuery(trend)
	}

	render(){
		return(
			<View style={{flex:10}}>
		        <View style={{flex:1}}>
		          <Heading title={"Search"}/>
		        </View>
		        <View style={styles.content}>
			        <View style={styles.setts}>		        
			            <Item style={{margin:10,paddingHorizontal:5,alignItems:'center',justifyContent:"center"}}>
				            <Icon style={styles.txt} active name='search' />
				            <Input style={styles.txt} 
				            	placeholder='Search..'
				             	onChangeText={(text) => this.setState({query:text})}/>
				        </Item>
						<View style={styles.pikerWrapper}>
						    <View style={[styles.piker,{marginRight:3.5}]}>
						    	<Picker
						          style={{color:"#ffc080"}}
						          selectedValue={this.state.selectedImageType}
						          onValueChange={this.onImageTypeChange.bind(this)}
						        >
						          <Picker.Item label="Image Type" value="all" />
						          <Picker.Item label="All" value="all" />
						          <Picker.Item label="Photo" value="photo" />
						          <Picker.Item label="Illustration" value="illustration" />
						          <Picker.Item label="Vector" value="vector" />
						        </Picker>
						    </View>
						    <View style={[styles.piker,{marginLeft:3.5}]}>
						    	<Picker
						          style={{color:"#ffc080",elevation:5}}
						          selectedValue={this.state.selectedOrientation}
						          onValueChange={this.onOrientationChange.bind(this)}
						        >
						          <Picker.Item label="Orientation" value="vertical" />
						          <Picker.Item label="Vertical" value="vertical" />
						          <Picker.Item label="Horizontal" value="horizontal" />
						        </Picker>
						    </View>
						</View>
						<View style={{flexDirection:'column'}}>
							<View style={styles.switch}>
						    	<Text style={styles.txt}>Editors Choice</Text>
						    	<Switch
						          onValueChange = {()=>{this.toggleSwitch('ec')}}
						          value = {this.state.editorsChoice}/>
						    </View>
						    <View style={styles.switch}>
						    	<Text style={styles.txt}>Safe Search</Text>
						    	<Switch
						          onValueChange = {()=>{this.toggleSwitch('ss')}}
						          value = {this.state.safeSearch}/>
						    </View>
						</View>
						<View style={{marginTop:10}}>
								<View style={styles.trending}>
									<Text style={[{textAlign:'center',fontSize:18,letterSpacing:5,color:'#ffc080'}]}>Trending Searches
									</Text>
									<Icon style={{color:'#ffc080',marginLeft:5,fontWeight:800}} name="ios-trending-up"/>
								</View>
								<FlatList
								  data={trends}
								  renderItem={({item}) => 
								  <TouchableOpacity onPress={()=>{this.trendSearch(item.key)}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} on>
								  	<Text style={[styles.txt,{fontSize:20,textAlign:'center'}]}>
									  {item.key}
									 </Text>
									 <Icon style={{color:'gray',marginLeft:10,fontSize:18}} name="arrow-forward"/>
								  </TouchableOpacity>
								}
								/>
						</View>
					</View>

					<RaisedTextButton 
					    rippleDuration={600} 
					    rippleOpacity={0.54} 
					    color='#343944'
					    title="Search"
					    titleColor="#ffc080"
					    titleStyle={[styles.txt,{letterSpacing:5,fontSize:22}]}
					    style={styles.sBtn}
						onPress={()=>{this.fireQuery()}}
					/>
        		</View>
		    </View>
		);
	}
}
const styles = StyleSheet.create({
	txt:{
		color:"#ffc080",
		fontSize:18,
		alignItems:'center',
		justifyContent:'center'
	},
	border:{
		borderColor:"#ffc080"
	},
	pikerWrapper:{
		flexDirection:'row',
		marginBottom:20,
		marginTop:20,
	},
	piker:{
		flex:1,
		borderWidth:1,
		borderRadius:3,
		borderColor:'gray'
	},
	switch:{
		borderBottomWidth:0.5,
		borderColor:'gray',
		flexDirection:'row',
		justifyContent:'space-between',
		marginVertical:2.5,
		padding:2.5
	},
	setts:{},
	content:{
		flex:10,
		padding:10,
		backgroundColor:'#343944',
		justifyContent:'space-between'
	},
	sBtn:{
		borderColor:'gray',
		borderWidth:0.5,
		elevation:5,
		padding:10
	},
	trending:{
		marginTop:10,
		marginBottom:5,
		paddingBottom:5,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		borderBottomWidth:0.5,
		borderColor:'gray',
	}

})



export default createStackNavigator({
  Search: {
    screen: Search
  },
  Result: {
    screen: props => <ContentX {...props} isSearch={true} query={"cars"}/>
  }
},{
	initialRouteName: "Search",
   	navigationOptions: {header: null}
});