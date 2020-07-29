import React, { Component } from "react";
import {Text,StyleSheet,View } from "react-native";
import {Left,Right,Header,Icon,Container} from "native-base";
class Heading extends Component{
    render(){
        return (
            <Container style={style.container}>
                <Header style={{backgroundColor:'#343944'}}>
                    <Left style={{flex:1,justifyContent:'flex-start',flexDirection:'row',alignItems:'center'}}>
                        {
                            this.props.onPress ? <Icon name="arrow-back" 
                            onPress={this.props.onPress}
                            style={{fontSize:30,color:"#ffc080",paddingRight:10}} 
                        /> : <View/>
                        }
                        
                        <Text style={style.txt}>{this.props.title}</Text>
                    </Left>
                    {
                        this.props.title == "Favs" 
                        ?
                        <Right>
                            <Icon onPress={()=>{this.props.onPressRefresh()}} style={{fontSize:40,color:"#ffc080",paddingRight:10}}  name="ios-refresh"/>
                        </Right>
                        :
                        <View/>
                    }
                    
                </Header> 
            </Container>
        );
    }
}
const style=StyleSheet.create({
    container:{
       backgroundColor:'#343944',
       elevation:5
    },
    txt:{
        color:'#ffc080',
        fontSize:26,
        paddingLeft:5
    }
});

export default Heading;