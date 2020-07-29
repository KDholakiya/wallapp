import React from "react"
import { 
  View,
  Text,
  ScrollView,
  AsyncStorage,
  ToastAndroid
} from "react-native";
import Heading from "./../components/heading"
import SignInUp from "./SignInUp"
import { createStackNavigator,NavigationEvents } from 'react-navigation';
import { RaisedTextButton } from 'react-native-material-buttons';
import fireB from "./../components/fireB"
import FetchX from "./../components/FetchX"
import ImageViewer from "./../components/ImageViewer"
import { 
	SkypeIndicator
} from 'react-native-indicators'

class Favs extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	isLoggedIn:false,
	  	user:null,
	  	dataX:null,
	  	isLoading:true,
	  	lastCounted:0
	  };
	}
	async componentDidMount(){
		await this.isLoggedin()
	}
	fetchFromFirebase = async () =>{
		data = await fireB.fetchFavs(this.state.user.email)
		if(data !== null){
			await this.fetchFromAPI(Object.values(data))
			email = this.state.user.email.slice(0,this.state.user.email.length-4) + "(dot)com"
			count = await fireB.favCounter(email,'false',true)
			this.setState({
				lastCounted:count
			})
		}else{
			console.warn("Nothing To Show")
		}
	}
	fetchFromAPI = async (imgIds) => {
		let fetchX = new FetchX()
		let dataX = []
		const promiseArray = imgIds.map(async (elem) => {
	        return new Promise(async (resolve, reject) => {
	        	data = await fetchX.getSingle(elem.id)
                return resolve(data.hits[0]);
		  });
		});
        Promise.all(promiseArray).then((data) => {
		  	this.setState({dataX:data},()=>{
		  		this.setState({isLoading:false})
		  	})
		},this)
	}
	isLoggedin = async()=>{
		this.setState({isLoading:true})
		let user = await AsyncStorage.getItem('user');
		if (user !== null) {
			user = JSON.parse(user)
			this.setState({ user:user },()=>{
				this.fetchFromFirebase()
			})
		}else{
			this.setState({ user:null })
			this.setState({isLoading:false})
		}
		return user
	}
	refresh = async () =>{
		email = this.state.user.email.slice(0,this.state.user.email.length-4) + "(dot)com"
		count = await fireB.favCounter(email,'false',true)
		if(this.state.lastCounted !== count){
			this.setState({isLoading:true})
			await this.fetchFromFirebase()
			this.setState({isLoading:false})
		}else{
			this.toast("Noting New")
		}
	}
	toast=(msg)=>{ ToastAndroid.show(msg, ToastAndroid.SHORT); }
	render(){
		if(this.state.isLoading){
    		return(
    			<View style={{flex:10,backgroundColor:'#343944'}}>
	        		<View style={{flex:1}}>
	        			<Heading title={"Favs"} onPressRefresh={()=>{}}/>
	        		</View>
	    			<View style={{flex:10,justifyContent:'center',alignItems:'center'}}>
				        <SkypeIndicator  color='#ffc080' size={45}/>
				    </View>
			    </View>
    		)
    	}else{
			return(
				<View style={{flex:10}}>
			        <View style={{flex:1}}>
			          <Heading title={"Favs"} onPressRefresh={()=>{this.refresh()}}/>
			          <NavigationEvents onWillFocus={()=>{this.isLoggedin()}} />
			        </View>
			        {
			        	this.state.user != null
			        	? 
	   			        	<View style={{flex:10,backgroundColor:'#343944'}}>
	   			        		{this.state.dataX
	   			        			?
						        	<View style={{flex:10,marginTop:10}}>
							        	<ScrollView>
							        		<ImageViewer dataX={this.state.dataX} />
							        	</ScrollView>
						        	</View>
									:
									<View style={{flex:10}}>
							        	<View style={{flex:1,margin:10,justifyContent:'center',alignItems:'center'}}>
							        		<Text style={{letterSpacing:5,fontSize:18,color:'gray'}}>
								        		You've Not Liked Any photos
								        	</Text>
							        	</View>
									</View>
	   			        		}
					        	
					        </View>		        						        
			        	:
			        	<View style={{flex:10,backgroundColor:'#343944'}}>
				        	<View style={{flex:10,justifyContent:'center',alignItems:'center'}}>
					    		<Text style={{fontSize:20,marginBottom:20,color:'gray'}}>Yo're Not Logged in Please Log in First..</Text>
					    		<RaisedTextButton  rippleDuration={600}  rippleOpacity={0.54} 
					                color='#343944' titleColor='#ffc080'  title="Log in / Register"
					                onPress={()=>{
					                	this.props.navigation.navigate('SignInUp',{
									      onGoBack: () => this.isLoggedin(),
									    });
					                }}
					                titleStyle={[{fontSize:18}]}
					                style={{borderColor:'#ffc080',borderRadius:3,borderWidth:0.5}}
					            />  
					    	</View>
					    </View>
			        }
			        
			    </View>
			);
		}
	}
}

export default createStackNavigator({
  Favs: {
    screen: Favs
  },
  SignInUp: {
    screen: props => <SignInUp {...props} title={"Register"}/>
  }
},{
	initialRouteName: "Favs",
	navigationOptions: {header: null}
});