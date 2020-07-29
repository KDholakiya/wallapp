import React,{Component} from 'react'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Modal,
  	ToastAndroid,
	} from 'react-native'
import { 
	SkypeIndicator
} from 'react-native-indicators'
import { 
	Container, 
	Item, 
	Label, 
	Form, 
	Button, 
	Text,
	Icon,
	Input
} from 'native-base';
import fireB from "./../components/fireB"

export default class SignInUp extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	isShowModal:true,
	  	view:0,
	  	isLoading:false,
	  	email:'',
	  	password:'',
	  	username:''
	   };
	}

	toast=(msg)=>{ ToastAndroid.show(msg, ToastAndroid.SHORT); }

	goback=()=>{
		if(this.props.from !== "img"){
			this.props.navigation.state.params.onGoBack();
			this.props.navigation.goBack();
		}else{
			//this.setState({ isShowModal:false })
			this.props.onClose()
		}
	}


	signIn=async ()=>{
		this.setState({isLoading:true})
		user={
			email:this.state.email,
			password:this.state.password,
		}
		status = await fireB.logIn(user)
		this.setState({isLoading:false})
		if(status) { this.goback() }
	}
	signUp = async () => {
		this.setState({isLoading:true})
		user={
			email:this.state.email,
			password:this.state.password,
			username:this.state.username
		}
		status = await fireB.signUp(user)
		this.setState({isLoading:false})
		if(status){ this.goback() }
	}
	switchView = () =>{
		this.setState({
			email:'',
		  	password:'',
		  	username:'',
		},()=>{
			this.setState({ view:this.state.view == 0 ? 1 : 0 })
		})
	}
	resetPass = () =>{
		if(this.state.email == ''){
			this.toast("Please Enter Your Email")
			return;
		}
		fireB.resetPassword(this.state.email)
	}
	render=()=>{
		return(
			<Modal
			  	onRequestClose={() => { this.goback() }}
			>

    			<Container style={styles.container}>
    				<View style={{position:'absolute',top:10,right:10,zIndex:1}}>
						<Button transparent onPress={()=>{this.goback()}}>
    						<Icon name="ios-close" style={{fontSize:50,color:'gray',fontWeight:'800',textAlign:'center'}}/>
    					</Button>    					
    				</View>
	    			<View style={{position:'absolute',top:0,bottom:0,right:0,left:0,opacity:this.state.isLoading ? 1 : 0}}>
				        <SkypeIndicator  color='#ffc080' size={45}/>
				    </View>
	    			<View style={{justifyContent:'center',alignItems:'center',paddingBottom:20}}>
	    				<Text style={{fontSize:20,letterSpacing:3,color:'gray'}}> {this.state.view == 0 ? 'Login' : 'Register'} To WallApp</Text>
	    			</View>
    			{
    				this.state.view==0 
    				?
					<Form style={{elevation:5,margin:10,borderRadius:10,padding:20}}>
						<Item floatingLabel style={styles.item}>
							<Label style={styles.txt}>Email</Label>
							<Input
								autoCorrect={false}
								autoCapitalize="none"
								onChangeText={(text) => {this.setState({email:text})}}
								value={this.state.email}
							/>
						</Item>
						<Item floatingLabel style={styles.item}>
							<Label style={styles.txt}>Password</Label>
							<Input
								onChangeText={(text) => {this.setState({password:text})}}
								secureTextEntry={true}
								autoCorrect={false}
								autoCapitalize="none"
								value={this.state.password}
							/>
						</Item>
						<Button onPress={()=>{this.signIn()}} style={styles.item}  full rounded success>
							<Text >Login</Text>
						</Button>
						<View style={[{flexDirection:'row'},styles.item]}>
							<TouchableWithoutFeedback onPress={()=>{this.switchView()}} >
								<Text style={[styles.txt,{textAlign:'center'}]}>Not Yet Member?</Text>
							</TouchableWithoutFeedback>
							<Text style={[styles.txt,{textAlign:'center',marginHorizontal:10}]}>|</Text>
							<TouchableWithoutFeedback onPress={()=>{this.resetPass()}} style={styles.item}>
								<Text style={[styles.txt,{textAlign:'center'}]}>Forgot Password?</Text>
							</TouchableWithoutFeedback>

						</View>
							
					</Form>
					    				:
					<Form style={{elevation:5,margin:10,borderRadius:10,padding:20}}>
						<Item floatingLabel style={styles.item}>
							<Label style={styles.txt}>Username</Label>
							<Input
								onChangeText={(text) => {this.setState({username:text})}}
								autoCorrect={false}
								autoCapitalize="none"
								value={this.state.username}
							/>
						</Item>
						<Item floatingLabel style={styles.item}>
							<Label style={styles.txt}>Email</Label>
							<Input
								onChangeText={(text) => {this.setState({email:text})}}
								autoCorrect={false}
								autoCapitalize="none"
								value={this.state.email}
							/>
						</Item>
						<Item floatingLabel style={styles.item}>
							<Label style={styles.txt}>Password</Label>
							<Input 
								onChangeText={(text) => {this.setState({password:text})}}
								secureTextEntry={true}
								autoCorrect={false}
								autoCapitalize="none"
								value={this.state.password}
							/>
						</Item>
						<Button onPress={()=>{this.signUp()}} style={styles.item}  full rounded success>
							<Text >Sign Up</Text>
						</Button>
						<TouchableWithoutFeedback onPress={()=>{this.switchView()}} style={styles.item}>
							<Text style={[styles.txt,{textAlign:'center'}]}>Already a Member?</Text>
						</TouchableWithoutFeedback>
					</Form>
    			}
			    </Container>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#343944',
		justifyContent:'center',

	},
	txt:{
		color:'#C1C8D1'
	},
	item:{
		margin:10,
		paddingHorizontal:5,
		alignItems:'center',
		justifyContent:"center"
	}
})