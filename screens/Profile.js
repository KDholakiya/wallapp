import React from "react"
import { 
  View,
  Dimensions,
  Text,
  AsyncStorage,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Linking,
  ToastAndroid,
} from "react-native";

import {
	Card, 
	CardItem, 
	Button, 
	Icon, 
	Left, 
	Body, 
	Right,
	Textarea
} from 'native-base';
import Heading from "./../components/heading"
import { RaisedTextButton } from 'react-native-material-buttons';
import {
	SkypeIndicator
} from 'react-native-indicators'
import SignInUp from "./SignInUp"
import { createStackNavigator,NavigationEvents } from 'react-navigation';
import fireB from "./../components/fireB"

let DIM = Dimensions.get('window')

class Profile extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = { 
	  	username:"",
	  	emailId:"",
	  	password:'',
	  	isLoggedIn:false,
	  	isLoading:true,
	  	feedback:''
	  };
	}
	componentDidMount(){
		this.fetchUserInfo()
	}
	fetchUserInfo = async () => {
		try {
		    let user = await AsyncStorage.getItem('user');
		    if (user !== null) {
		    	user = JSON.parse(user)
		      	this.setState({ 
		      		emailId:user.email,
		      		password:user.password,
		      		username:user.username,
		      		isLoggedIn:true 
		      	})
		    }else{ 
		    	this.setState({ isLoggedIn:false })
		    }
		} catch (error) {
		    console.warn(error.toString())
		    this.setState({ isLoggedIn:false })
		}finally{
			this.setState({ isLoading:false })
		}
	}
	logOut=async ()=>{
		fireB.signOut()
		await AsyncStorage.removeItem('user');
		this.setState({
			username:"",
		  	emailId:"",
		  	password:'',
		  	isLoggedIn:false,
		  	isLoading:false 
	  	})
	}
	sendFeedback = () =>{
		if(!this.state.isLoggedIn){
			this.toast("please Login To Your Account First")
			return
		}
		txt = this.state.feedback.trim()
		if(txt !== ""){
			fireB.sendFeedback(txt,this.state.emailId)
		}else{
			this.toast("Please Enter Feedback")
		}
	}
	toast=(msg)=>{ ToastAndroid.show(msg, ToastAndroid.SHORT); }
	render(){
		if(this.state.isLoading){
			return(
				<View style={{flex:10,backgroundColor:'#343944'}}>
	        		<View style={{flex:1}}>
	        			<Heading title={"Profile"}/>
	        		</View>
	    			<View style={{flex:10,justifyContent:'center',alignItems:'center'}}>
				        <SkypeIndicator  color='#ffc080' size={45}/>
				    </View>
			    </View>
			)
		}else{
			return(
				<View style={{flex:10}}>
					<NavigationEvents onWillFocus={()=>{if(!this.state.isLoggedIn)this.fetchUserInfo()}} />
					<View style={{flex:1}}>
		        		<Heading title={"Profile"}/>
		        	</View>
					<View style={{flex:10,backgroundColor:'#343944',justifyContent:'space-between'}}>
			        { 
			        	this.state.isLoggedIn 
			        	? 
				    	<View 
				    		style={{
				    			marginHorizontal:10,
				    			marginTop:5,
				    	}}>
				    		<Card transparent style={{backgroundColor:'#343944'}}>
					            <CardItem style={{backgroundColor:'#343944',borderColor:'#ffc080',
							    borderRadius:5,
							    borderWidth:0.5}}>
					              <Left>
					                <Body>
					                  <Text style={{color:'#C1C8D1',fontSize:16}}>{this.state.username}</Text>
					                  <Text style={{color:'#5294E2',fontSize:13}} note>{this.state.emailId}</Text>
					                </Body>
					              </Left>
					              <Right>
					              	<Button transparent onPress={()=>{this.logOut()}}>
					              		<Icon name="log-out" style={{fontSize:30}}/>
					              	</Button>
					              </Right>
					            </CardItem>
						            <TouchableOpacity 
								 	style={{alignItems:'center',paddingBottom:5,borderColor:'#ffc080',
							    borderRadius:5,
							    borderWidth:0.5,}}
								 	onPress={()=>{fireB.resetPassword(this.state.emailId)}}>
								 		<Text style={{fontSize:20,color:'gray'}}>Reset Password</Text>
								 </TouchableOpacity>
					        </Card>
							 
				    	</View>
				    	:
				    	<View style={{alignItems:'center',borderColor:'#ffc080',
							    borderRadius:5,
							    borderWidth:0.5,margin:10}}>
				    		<RaisedTextButton  rippleDuration={600}  rippleOpacity={0.54} 
				                color='#343944' titleColor='#ffc080'  title="Log in / Register"
				                onPress={()=>{
				                	this.props.navigation.navigate('SignInUp',{
								      onGoBack: () => this.fetchUserInfo(),
								    });
				                }}
				                titleStyle={[{fontSize:18}]}
				                style={{
				                	borderColor:'#ffc080',
				                	borderRadius:3,
				                	borderWidth:0.5,
				                	width:'100%',
				                }}
				            />  
				    	</View>
				    }
					    <View style={{flex:1,marginTop:20,justifyContent:'space-between',backgroundColor:'#343944'}}>
					    	<View style={{flex:1,}}>
				    			
				    			<View style={{
				    				elevation:2,
				    				flex:1,
				    				margin:10,
				    				justifyContent:'flex-start'
				    			}}>
				    				<View>
					    				<Textarea 
					    					onChangeText={(text) => {this.setState({feedback:text})}} 
					    					maxLength={200} rowSpan={7} 
					    					placeholder="Write Your Feedback About App"
					    					placeholderTextColor={'gray'}
					    					style={{
							                	borderColor:'#ffc080',
							                	borderRadius:5,
							                	borderWidth:0.5,
							                	borderBottomLeftRadius:0,
							                	borderBottomRightRadius:0,
							                	color:'gray'
							                }} 
							            />
						             </View>
				    				<RaisedTextButton  rippleDuration={600}  rippleOpacity={0.54} 
						                color='#343944' titleColor='#ffc080'  title="Send Feedback"
						                onPress={()=>{ this.sendFeedback() }}
						                titleStyle={[{fontSize:18}]}
						                style={{
						                	borderColor:'#ffc080',
						                	borderRadius:5,
						                	borderWidth:0.5,
						                	width:'100%',
						                	borderTopLeftRadius:0,
						                	borderTopRightRadius:0,
						                }}
						            />  
				    			</View>
					    	</View>
							<View style={{justifyContent:'space-between'}}>
								<View style={{justifyContent:'flex-end',alignItems:'center'}}>
									<View style={{flexDirection:'row'}}>
										<Text style={{letterSpacing:5,fontSize:18,color:'#ffc080',marginRight:2.5}}>
											   Crafted By
										</Text>
										<TouchableWithoutFeedback style={{marginLeft:2.5}} onPress={()=>{Linking.openURL('https://keval47.github.io')}}>
											<Text style={{letterSpacing:5,fontSize:18,color:'#5294E2'}}>
												Keval Dholakiya
											</Text>
										</TouchableWithoutFeedback>
									</View>
										
									<Text style={{fontSize:16,color:'gray',margin:5}}>
										This App uses Pixabay Service
									</Text>
									<TouchableWithoutFeedback onPress={()=>{Linking.openURL('https://pixabay.com/')}} style={{width:'100%'}}>
										<Image
										  	source={{uri: 'https://pixabay.com/static/img/public/leaderboard_b.png'}}
										  	style={{height:50,width:DIM.width,resizeMode:"contain"}}
										/> 
									</TouchableWithoutFeedback>
								</View>
							</View>
						</View>
					</View>
				</View>
			)
		}
	}
}

export default createStackNavigator({
  Profile: {
    screen: Profile
  },
  SignInUp: {
    screen: props => <SignInUp {...props} title={"Register"}/>
  }
},{
	initialRouteName: "Profile",
	navigationOptions: {header: null}
});