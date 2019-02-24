import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:kiam/qr.dart';

void main() => runApp(new MyHomePage());



//Stateful
class MyHomePage extends StatefulWidget {


  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  String result = '';

//ScaffoldState global key
  static GlobalKey<ScaffoldState> scaffoldKey = new GlobalKey<ScaffoldState>();

  //local auth vars
  final LocalAuthentication auth = LocalAuthentication();
  String _authorized = 'Not Authorized';

  //firebase instatnt
  FirebaseMessaging _firebaseMessaging = new FirebaseMessaging();

  @override
  void initState() {
    super.initState();

    //firebase configerations
    _firebaseMessaging.configure(
      onMessage: (Map<String, dynamic> message) {
        print('on message $message');
        _authenticate();
      },
      onResume: (Map<String, dynamic> message) {
        print('on resume $message');
      },
      onLaunch: (Map<String, dynamic> message) {
        print('on launch $message');
      },
    );
    _firebaseMessaging.requestNotificationPermissions(
        const IosNotificationSettings(sound: true, badge: true, alert: true));
  }

//fingerprint authentication
  Future<Null> _authenticate() async {
    bool authenticated = false;
    try {
      authenticated = await auth.authenticateWithBiometrics(
          localizedReason: 'Scan your fingerprint to authenticate',
          useErrorDialogs: true,
          stickyAuth: true);
    } on PlatformException catch (e) {
      print(e);
    }
    if (! mounted) return;

    setState(() {



      _authorized = authenticated ? 'Authorized' : 'Not Authorized';
      if (authenticated == true) {

        String auth = "true";
        print('AUTHENTICATION $authenticated');
        var url = "http://192.168.1.33:4000/api/verify_fingerprint/" + auth;
         http.get(url).then((response) {
          print("Response status: ${response.statusCode}");
          print("Response body :  ${response.body}");
          if(response.body == "true"){
            result= "true";
            showSnackBar("Access Granted");
          }
        });
      } else {
        print("fingerPrint does not match");
      }
    });
  }


  //snackbar
    showSnackBar(message)  {
    final snackBar = new SnackBar(

      content: new Text(message),
      duration: new Duration(seconds: 5),
      backgroundColor: result ==  "true" ? Colors.green : Colors.red,
    );
    scaffoldKey.currentState.showSnackBar(snackBar);
  }



  Widget build(BuildContext context) {
    return new MaterialApp(
      home: new Scaffold(
        key: scaffoldKey,
          body: new QR()),


    );

  }

}