// Imports(Core): React, React Native
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

// Imports: React Third Party Packages
import { Input, CheckBox, Button, Icon } from 'react-native-elements';

// Imports: Expo
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import { SaveFormat } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';



// Export Component: <Login />
class LoginTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      remember: false
    };
  }

  static navigationOptions = { 
    title: 'Login',
    tabBarIcon: ({ tintColor }) => (
      <Icon 
        name='sign-in'
        type='font-awesome'
        iconStyle={{ color: tintColor }}
      />
    )
  }

  handleLogin() {
    console.log(JSON.stringify(this.state));

    if (this.state.remember) {
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({ username: this.state.username, password: this.state.password })
      )
      .catch((error) => console.log('Could not save user info', error));
    }
    else {
      SecureStore.deleteItemAsync('userinfo')
        .catch((error) => console.log('Could not delete user info', error));
    }
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
      .then((userdata) => {
        const userinfo = JSON.parse(userdata);
        if (userinfo) {
          this.setState({ username: userinfo.username });
          this.setState({ password: userinfo.password });
          this.setState({ remember: true });
        }
      });
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Input 
          placeholder='Username'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input 
          placeholder='Password'
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          leftIconContainerStyle={styles.formIcon}
        />
        <CheckBox 
          title='Remember Me'
          center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button 
            title='Login'
            color='#5637DD'
            onPress={() => this.handleLogin()}
            buttonStyle={{ backgroundColor: '#5637DD' }}
            icon={
              <Icon 
                name='sign-in'
                type='font-awesome'
                color='#fff'
                iconStyle={{ marginRight: 10 }}
              />
            }
          />
        </View>
        <View style={styles.formButton}>
          <Button 
            title='Register'
            type='clear'
            onPress={() => this.props.navigation.navigate('Register')}
            titleStyle={{ color: 'blue' }}
            icon={
              <Icon 
                name='user-plus'
                type='font-awesome'
                color='blue'
                iconStyle={{ marginRight: 10 }}
              />
            }
          />
        </View>
      </View>
    );
  }
}


class RegisterTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false,
      imageUrl: baseUrl + 'images/logo.png'
    }
  }

  static navigationOptions = { 
    title: 'Register',
    tabBarIcon: ({tintColor}) => (
      <Icon 
        name='user-plus'
        type='font-awesome'
        iconStyle={{ color: tintColor }}
      />
    )
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const mediaPermission = await MediaLibrary.requestPermissionsAsync();

    console.log(mediaPermission);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1] });

      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        this.processImage(capturedImage.uri);
      }
    }
  }

  processImage = async (imgUri) => {
    const processedImage = await ImageManipulator.manipulateAsync(imgUri, [{resize: { width: 400 }}], { format: SaveFormat.PNG });
    MediaLibrary.saveToLibraryAsync(imgUri);
    console.log(processedImage);
    this.setState({ imageUrl: processedImage.uri });
  }

  getImageFromGallery = async () => {
    const cameraRollPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraRollPermissions) {
      const capturedImage = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1]});
      console.log(capturedImage);
      this.processImage(capturedImage.uri);
    }
  };

  handleRegister() {
    console.log(JSON.stringify(this.state));

    if (this.state.remember) {
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({ username: this.state.username, password: this.state.password })
      )
      .catch((error) => console.log('Could not save user info', error));
    }
    else {
      SecureStore.deleteItemAsync('userinfo')
        .catch((error) => console.log('Could not delete user info', error));
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: this.state.imageUrl }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
          <Button 
            title='Camera'
            onPress={this.getImageFromCamera}
          />
          <Button 
            title={'Gallery'}
            onPress={this.getImageFromGallery}
          />
        </View>
        <View style={styles.container}>
          <Input 
            placeholder='Username'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input 
            placeholder='Password'
            leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input 
            placeholder='First Name'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(firstname) => this.setState({ firstname })}
            value={this.state.firstname}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input 
            placeholder='Last Name'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(lastname) => this.setState({ lastname })}
            value={this.state.lastname}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input 
            placeholder='Email'
            leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            leftIconContainerStyle={styles.formIcon}
          />
          <CheckBox 
            title='Remember Me'
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button 
              title='Register'
              color='#5637DD'
              onPress={() => this.handleRegister()}
              buttonStyle={{ backgroundColor: '#5637DD' }}
              icon={
                <Icon 
                  name='user-plus'
                  type='font-awesome'
                  color='#fff'
                  iconStyle={{ marginRight: 10 }}
                />
              }
            />
          </View>         
        </View>
      </ScrollView>
    );
  }
}


const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#5637DD',
      inactiveBackgroundColor: '#CEC8FF',
      activeTintColor: '#fff',
      inactiveTintColor: '#808080',
      labelStyle: { fontSize: 16 }
    }
  }
)


// Styles
const styles = StyleSheet.create(
  {   
    container: {
      justifyContent: 'center',
      margin: 10
    },

    formIcon: {
      marginRight: 10
    },

    formInput: {
      padding: 8
    },
    
    formCheckbox: {
      margin: 8,
      backgroundColor: null
    },

    formButton: {
      margin: 20,
      marginLeft: 40,
      marginRight: 40
    },

    imageContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      margin: 10
    },

    image: {
      width: 60,
      height: 60
    }
  }
);

export default Login;