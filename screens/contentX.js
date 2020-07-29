import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	ScrollView,
    ToastAndroid
} from "react-native";
import { 
	SkypeIndicator,
    DotIndicator
} from 'react-native-indicators'
import ImageViewer from './../components/ImageViewer'
import { RaisedTextButton } from 'react-native-material-buttons';

import Heading from "./../components/heading"
import { Container } from "native-base"
import FetchX from "../components/FetchX"

class ContentX extends Component{
    DIM = Dimensions.get('window')
    constructor(props){
        super(props);
        this.state={
            dataX : [],
            totalHits : 0,
            page: 1,
            isLoading:true,
            isLoadingMore:false,
            isImageAvailabe:true,
            query:"",
            filters:[],
            isHorizontal:false
        }
    }
    componentDidMount(){
        if(this.props.isSearch){
           query=this.props.navigation.getParam('query')
           filters = this.props.navigation.getParam('filters')
           if(filters.orientation == "horizontal") this.setState({isHorizontal:true})
        }  
        else{
          query=this.props.query
          filters = []
        }
        this.setState({ query:query,filters:filters },this.fetchImages(query))
    }
    fetchImages=(query,page=1)=>{
    	let fetchX = new FetchX()

        let isSearch = this.props.isSearch

        if(isSearch) fx = fetchX.search(query,page,filters)
        else fx = fetchX.get(query,page)
           
    	fx.then(data=>{
            if(data){
                if(data.totalHits != 0){
                    dataY = this.state.dataX.concat(data.hits)
                    dataY = dataY.filter(function(elem) {
                        if(!elem.previewURL.includes(".png")){
                            data.totalHits--
                            return elem;
                        } 
                    });
                    this.setState({
                        dataX:dataY,
                        totalHits:data.totalHits,
                        isLoading:false,
                        isLoadingMore:false
                    }) 
                }else this.noMoreImage()
                
            }else{
                this.noMoreImage()
            }
    	})
    }
    noMoreImage=()=>{
        if(this.state.dataX == ""){
            this.toast("We Found Nothing For You :(")
            //this.props.navigation.goBack()
        } 
        else this.toast("There's No More Images")
        this.setState({ isLoadingMore:false,isLoading:false,isImageAvailabe:false })
        return false
    }
    changePage = () =>{
    	if(!this.state.isImageAvailabe) return;

        query= this.state.query
    	page = this.state.page + 1
    	this.setState({ page:page,isLoadingMore:true })
    	this.fetchImages(query,page)

    }
    imageLoader = () =>{
    	return(
    		<ImageViewer dataX={this.state.dataX} totalHits={this.state.totalHits} isHorizontal={this.state.isHorizontal}/>
		)
    }
    toast=(msg)=>{
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    render(){
    	if(this.state.isLoading){
    		return(
    			<View style={{flex:10,backgroundColor:'#343944'}}>
	        		<View style={{flex:1}}>
	        			<Heading 
                            title={this.state.query} 
                            onPress={()=>{this.props.navigation.goBack()}}/>
	        		</View>
	    			<View style={{flex:10,justifyContent:'center',alignItems:'center'}}>
				        <SkypeIndicator  color='#ffc080' size={45}/>
				    </View>
			    </View>
    		)
    	}else{
            return (
                <View style={{flex:10,backgroundColor:'#343944'}}>
                    <View style={{flex:1}}>
                        <Heading 
                            onPress={()=>{this.props.navigation.goBack()}} 
                            title={this.state.query}/>
                    </View>
                    <Container style={{flex:10}}>
                        <ScrollView style={{backgroundColor:'#343944'}}>
                            {this.imageLoader()}

                            {this.state.isImageAvailabe 
                                ? 
                                <View style={{flex:1,padding:4,justifyContent:'center',alignItems:'center'}}>
                                    {this.state.isLoadingMore 
                                        ? 
                                        <View style={{borderRadius:3,borderWidth:0.5,borderColor:'#ffc080',width:'100%'}}>
                                            <DotIndicator color='#ffc080' size={17}/> 
                                        </View>
                                        :
                                        <RaisedTextButton 
                                            rippleDuration={600} 
                                            rippleOpacity={0.54} 
                                            color='#343944'
                                            titleColor='#ffc080'
                                            onPress={()=>{this.changePage()}}
                                            title="Load More"
                                            style={{borderColor:'#ffc080',borderRadius:3,borderWidth:0.5,width:'100%'}}
                                        />  
                                    }
                                </View>
                                :
                            <View/>}
                        </ScrollView>
                    </Container>
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
export default ContentX;