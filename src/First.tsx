
import React from 'react';
import { View, Image, StyleSheet,Text,TouchableOpacity, Button} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


const First= () => {

    const navigation = useNavigation(); 
    const handleTaskNavigation = () => {
      navigation.navigate('Task');
    };
  
  return (
    <View style={{ flex: 1 }}>
      <Svg height="120%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d="M0 0 H100 V50 Q50 60 0 50 Z" fill="#734BF9" />  
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <Image
              source={require('../assets/curve.png')}
                style={{ flex: 1, width: 300, height: 300, position: 'absolute',margin:-55,top:45,left:30
                }}
                resizeMode="cover"
              />
        <Image
                  source={require('../assets/bord.png')}
          style={{ position: 'absolute', top: '8%', width: '100%', height: '60%', marginLeft:-30 }}
          resizeMode="contain"
        />
        
      </View>
      <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d="M100 100 H0 V50 Q50 0 100 50 Z" fill="#D3D3D3" />
  
      </Svg>
     
     <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
        <Text style={styles.text}>Add a task {"\n"}to get started </Text>
        <View>
        <TouchableOpacity  onPress={handleTaskNavigation}  >
            {/* <Button onPress={handleTaskNavigation}  title='Add task'></Button> */}
            <FontAwesomeIcon icon={faPlusCircle} size={60} 
 style={{marginTop:60,color:'#3C0D90'}} />

      </TouchableOpacity>
    </View>
      </View>
   
     </View>
   
  );
};

const styles = StyleSheet.create({
  newView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop:550,
    fontWeight:'bold'
    
  }, textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn:{
    color:'#7F00FF',
    marginTop:50
  },
  

});



export default First;



     
 
