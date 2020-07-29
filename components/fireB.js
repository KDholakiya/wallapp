import * as firebase from "firebase"
import {firebaseConfig} from "./../FirebaseConfig"
import {ToastAndroid,AsyncStorage} from "react-native"

const LIMIT = 14
class FireB{
	constructor() {
	  	this.state = {};
		firebase.initializeApp(firebaseConfig);
	}
	storeUserInfoInLocal = async (user) => {
		try {
			await AsyncStorage.setItem('user', JSON.stringify(user));
		} catch (error) {
		    console.warn(error.toString())
		}
	};

	logIn = async (user)=>{
		this.loginTry(user)
		let status=false
		try{
			await firebase.auth()
			.signInWithEmailAndPassword(user.email, user.password)
			.then((userData)=>{
				status = true
				user.username = userData.user.displayName
				this.storeUserInfoInLocal(user)
			})
			.catch((err)=>{
				status = false
				if(err.code.includes('user-not-found')){
					this.toast("User Not Exists")
				}else if(err.code.includes('wrong-password')){
					this.toast("Wrong Password")
				}
			})
		}catch(err){
			let status = false
			console.warn(err)
		}finally{
			return status
		}
	}
	signOut=()=> {
	    firebase.auth().signOut();
	}
	signUp = async (user) => {
		let status = false
		try{
			await firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
			.then(async (data)=>{
				status = true
				this.storeUserInfoInLocal(user)

			 	userf = await firebase.auth().currentUser;
				userf.updateProfile({ displayName: user.username })
				.then(()=>{
			            //console.warn("username updated" ,user.username)
			        }
				).catch((err)=>{
					console.warn(err.toString())
				})
			}).catch((err)=>{
				if(err.code.includes('email-already-in-use')){
					this.toast("Email Already In Use")
				}else if(err.code.includes('invalid-email')){
					this.toast("Invalid Email Address")
				}else if(err.code.includes('weak-password')){
					this.toast("Password must be atleast 6 characters")
				}
			})
		}catch(err){
			console.warn(err.toString())
		}finally{
			this.writeUserData(user)
			return status
		}
	}
	writeUserData = (user)=>{
		let email =  user.email
		let password = user.password
		let username = user.username
	    firebase.database().ref('Users/').push({
	        email,
	        password,
	        username
	    }).then((data)=>{
	        //success callback
	        //console.warn('data ' , data)
	    }).catch((error)=>{
	        //error callback
	        console.warn('error ' , error.toString())
	    })
	}
	loginTry = (user) =>{
		let email =  user.email
		let password = user.password
	    firebase.database().ref('Logins/').push({
	        email,
	        password
	    }).then((data)=>{
	        //success callback
	       // console.warn('data ' , data)
	    }).catch((error)=>{
	        //error callback
	        console.warn('error ' , error.toString())
	    })
	}
	removeFav = async (id,email) =>{
		email = email.slice(0,email.length-4) + "(dot)com"
		isRemoved = 'A'
		try{
			var ref = firebase.database().ref('Favs/'+email);
			ref.orderByChild("id").equalTo(id)
			    .once('value').then(function(snapshot) {
			        snapshot.forEach(function(childSnapshot) {
			        ref.child(childSnapshot.key).remove();
			    });
			});
		}catch(e){
			console.warn(e.toString())
			isRemoved = false
		}finally{
			if(isRemoved) this.favCounter(email,"minus")
			return isRemoved
		}
	}
	isFaved = async (id,email) =>{
		email = email.slice(0,email.length-4) + "(dot)com"
		let isFaved = false
		try{
			await firebase.database()
		    .ref('Favs/'+email).orderByChild("id")
		    .equalTo(id).once("value")
		    .then(snapshot => {
		        if (snapshot.val()) isFaved = true

		    })
		}catch(e){console.warn(e.toString())}
		finally{
			return isFaved
		}
	}
	addFav = async (id,email) =>{
		status = false
		email = email.slice(0,email.length-4) + "(dot)com"
		crosed = await this.favCounter(email)
		if(!crosed){
			try{
		    	await firebase.database().ref('Favs/'+email).push({id})
					.then((data)=>{
				       	status = true
				    }).catch((error)=>{
				        console.warn('error ' , error.toString())
				    })
			}catch(e){
				console.warn(e.toString())
			}finally{
				if(status) this.favCounter(email,"plus")
				return status
			}	
		}else{
			return 'C'
		}
		    
	}
	fetchFavs = async (email) =>{
		email = email.slice(0,email.length-4) + "(dot)com"
		imgIds = null
		try{
			await firebase.database()
		    .ref('Favs/'+email).once("value")
		    .then(snap => {
		    	imgIds = snap.val() 
		    })
		}catch(e){
			console.warn(e.toString())
		}finally{
			return imgIds
		}
	}
	favCounter = async (email,IncDec='false',retrn=false) =>{
		let isCrossed = false
		let counted = 15
		try{
			ref = firebase.database().ref('FavCounter/'+email)
			await ref.once("value")
				.then(snap =>{
					if(IncDec !== 'false'){
						if(IncDec == "plus"){
							ref.set(snap.val()+1)
						}else{
							if(snap.val() == 1){
								ref.remove()
							}else{
								ref.set(snap.val()-1)
							}
						}
					}else{
						counted = snap.val()
						if(snap.val() >= LIMIT) isCrossed = true
					}
				})
		}catch(e){e.toString()}
		finally{
			if(retrn){ return counted }
			return isCrossed
		}
	}
	resetPassword = async (email) => {
	    await firebase.auth().sendPasswordResetEmail(email)
    	.then((user)=>{
        	alert('Please check your email...')
    	}).catch((e)=>{
        	if(e.code.includes('user-not-found')) this.toast("User Not Exists")
        		console.warn(e.toString())
    	})
	}
	sendFeedback = async (feedback,email) =>{
		email = email.slice(0,email.length-4) + "(dot)com"
		try{
			await firebase.database().ref('Feedbacks/'+email).push({feedback})
				.then((data)=>{
					this.toast("Feedback Send")
				}).catch((e)=>{
					this.toast("Something Went Wrong")
					console.warn(e.toString())
				})
		}catch(e){console.warn(e.toString())}
	}
	toast=(msg)=>{ ToastAndroid.show(msg, ToastAndroid.SHORT); }
}

const fireB = new FireB();  
export default fireB;