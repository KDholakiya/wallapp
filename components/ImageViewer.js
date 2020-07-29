import React,{Component} from 'react'
import {
	View,
	Image,
	Dimensions,
	TouchableWithoutFeedback,
	Modal,
	ImageBackground,
	CameraRoll,
  	ToastAndroid,
  	AsyncStorage,
  	PermissionsAndroid
 } from 'react-native'
import { 
    PulseIndicator
} from 'react-native-indicators'
import { 
	Button, 
	Text,
	Icon, 
	Fab 
} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'
import fireB from "./fireB"
import SignInUp from "./../screens/SignInUp"

let DIM = Dimensions.get('window')

export default class ImageViewer extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	img : "",
	  	fab:false,
	  	isShowModal : false,
	  	cacheImg:"",
	  	saved:false,
	  	height:null,
	  	width:null,
	  	isLoginModelShow:false,
	  	isLiked:false,
	  	user:null
	  };
	}

	componentDidMount(){
		if(this.props.isHorizontal){
			h = DIM.height/4
			w = DIM.width
		}else{
			h = DIM.height/2
			w = DIM.width/2
		}
		this.setState({
			height:h,
			width:w
		})
		this.isLoggedIn()
	}
	isLoggedIn = async () =>{
		let user = await AsyncStorage.getItem('user');
		if (user !== null) {
			user = JSON.parse(user)
			this.setState({
				user:user
			})
		}else{
			this.setState({
				user:null
			})
		}
	}
	toggleFullView = (item=[]) => {
		if(this.state.isShowModal){
			this.setState({
				img : null,
				isShowModal:false,
				fab:false,
				cacheImg:null,
				saved:false,
				isLiked:false,
			})	
		}else{
			this.setState({
				img : item,
				isShowModal:true
			},()=>{
				this.isLiked()
			})
			
			//cache
			RNFetchBlob.config({
		        fileCache : true,
		        appendExt : 'jpg'
		    }).fetch('GET', item.largeImageURL)
		    	.then((res) => {
		        this.setState({
		        	cacheImg:res.path()
		        })
			})
		}
	}
	toggleFab=()=>{
		this.setState({ fab:!this.state.fab })
	}
	imageRenderer = (elem,index) =>{
		return(
			<TouchableWithoutFeedback key={index} 
				onPress={()=>{this.toggleFullView(elem)}} >
				<View 
					style={{height:(this.state.height),
						width:(this.state.width),
						paddingBottom:5 ,paddingLeft:5,
						paddingRight: this.props.isHorizontal ? 5 : (index+1)%2 === 0 ? 5 : 0
					}}
					key={index}>
					<Image
					  source={{uri: elem.previewURL}}
					  style={{height:null,width:null,flex:1,resizeMode:'cover',borderRadius:8}}
					/> 
				</View>		
			</TouchableWithoutFeedback>	
		)
	}
	share = () =>{
		let shareOptions = {
	        title: "Wallapp",
	        message: "Check out this photo!",
	        url: this.state.img.largeImageURL,
      	}

     	Share.open(shareOptions)
        .then((res) => console.log('res:', res))
        .catch(err => console.log('err', err))
	}
	toast=(msg)=>{
		ToastAndroid.show(msg, ToastAndroid.SHORT);
	}
	isLiked = async () =>{
		try{
			let user = this.state.user
			if (user !== null) {
				id = this.state.img.id
				let faved = await fireB.isFaved(id,user.email)
				if(faved){
					this.setState({isLiked:true})
				}
			}
		}catch(e){console.warn(e.toString())}
		finally{

		}
	}
	like = async (backProp=false) => {
		try{
			let user = this.state.user
			if (user !== null) {
				id = this.state.img.id

				if(this.state.isLiked){
					status = await fireB.removeFav(id,user.email)
				}else{
					status = await fireB.addFav(id,user.email)
				}
				if(status == true){
					this.toast("added to favs")
					this.setState({isLiked:true})
				}else if(status == "A"){
					this.toast("Removed From Favs")
					this.setState({isLiked:false})
				}else if(status == 'C'){
					this.toast("Yo've Crossed Limit Of Fav Photo")
				}else{
					this.toast("hmm... something went wrong")
				}
			}else{
				if(!backProp){
					this.toast("Sign in First to Use this feature")
					this.setState({isLoginModelShow:true})
				}
			}
		}catch(e){ console.warn(e.toString()) }
			
	}
	save = async () =>{
		if(this.state.saved) {
			this.toast("Already Saved")
			return
		}
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
	    );
	    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	     	CameraRoll.saveToCameraRoll(this.state.cacheImg)
		    	.then(()=>{this.setState({saved:true}),this.toast("Photo Saved")})
		    	.catch(()=>{this.toast("We've No Rights To Save Photo")})
	    } else {
	      	this.toast("We've No Rights To Save Photo")
	    }
			
	}
	closeLoginModel=()=>{
		this.setState({isLoginModelShow:false})
		this.like(true)
	}
	render(){
		if(this.state.isLoginModelShow) 
			return( <SignInUp from={'img'} onClose={()=>{this.closeLoginModel()}}/> )
		else
		return(
			<View>
				{this.props.totalHits 
				  ?
					<View style={{padding:3,justifyContent:'center',alignItems:'center'}}>
                   		<Text style={{color:'#C1C8D1',fontSize:12}}>{this.props.totalHits} Items Found</Text>
                	</View>
                  :
                	<View/>
                }
                
    			<View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>
			    	{this.props.dataX.map(function(elem, index) {
						return(
							this.imageRenderer(elem,index)			
						)
					},this)}
				</View>
				{
					this.state.isShowModal 
					?
					<Modal
					  	onRequestClose={() => {
					    	this.toggleFullView()
					  	}}
					    visible={this.state.isShowModal}
					    transparent={true}
					    >
					    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(52, 57, 68, 0.9)'}}>
					        <PulseIndicator color='#ffc080' size={45}/>
					        <ImageBackground source={{uri: this.state.img.previewURL}} blurRadius={1} style={{position:'absolute',top:0,bottom:0,right:0,left:0}}>
					         	<PulseIndicator style={{position:'absolute',top:0,bottom:0,right:0,left:0}} color='#ffc080' size={45}/>
					         	{
					         		this.props.isHorizontal 
					         		? 
					         			<Image
											source={{uri: "file://"+this.state.cacheImg}}
											style={{height:null,width:"100%",resizeMode:'contain',flex:1}}
										/> 
					         		:
					         			<Image
											source={{uri: "file://"+this.state.cacheImg}}
											style={{height:null,width:null,resizeMode:'cover',flex:1}}
										/> 

					         	}
					         	
								<Fab
						            active={this.state.fab}
						            direction="up"
						            containerStyle={{ }}
						            style={{ backgroundColor: '#343944' }}
						            position="bottomRight"
						            onPress={()=>{this.toggleFab()}}>
						            <Icon name={this.state.fab ? "ios-arrow-down" : "ios-arrow-up"} style={{fontSize:30,color:"#ffc080"}}/>
						            <Button  onPress={()=>{this.share()}} style={{ backgroundColor: '#343944' }}>
						              	<Icon name="share" style={{color:"#ffc080"}}/>
						            </Button>
						            <Button onPress={()=>{this.like()}} style={{ backgroundColor: '#343944' }}>
						              	<Icon 
							              	name="ios-heart" 
							              	style={{
							              		color:this.state.isLiked? "red" :"#ffc080"
							              	}}
						              	/>
						            </Button>
						            <Button onPress={()=>{this.save()}} style={{ backgroundColor: '#343944' }}>
						            	<Icon name="download" style={{color:"#ffc080"}}/>
						            </Button>
						        </Fab>
					        </ImageBackground>
					    </View>
					</Modal>
					:
					<View/> 
				}
    		</View>
		)
	}
}
