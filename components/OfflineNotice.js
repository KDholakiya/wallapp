import React, { PureComponent } from 'react';
import { View, StyleSheet,Image,StatusBar } from 'react-native';
function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
        <StatusBar hidden = {true} />
        <Image style={{width:350,height:350}} source={require("./../assets/internet.png")}/>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  render() {
      return <MiniOfflineSign />;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    flex:1,
    backgroundColor: '#9E9E9E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: { 
    color: 'gray',
    fontSize:20,
  }
});
export default OfflineNotice;