import 'package:flutter/material.dart';
import 'package:barcode_scan/barcode_scan.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_messaging/firebase_messaging.dart';

class QR extends StatelessWidget {
  static GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  @override
  //qr scanner
  static Future scanQR() async {

    String result = " ";

    //firebase instatnt
    FirebaseMessaging _firebaseMessaging = new FirebaseMessaging();

    try {

      String qrResult = await BarcodeScanner.scan();
      var url = "http://192.168.1.33:4000/api/scan/" + qrResult;
      http.get(url).then((response) {
        print("Response status: ${response.statusCode}");
        print("Response body: ${response.body}");
        String qr_res = response.body;

        if (qr_res == "true") {
          _showSnackBar("Device Register Successfully");
          _firebaseMessaging.getToken().then((token) {
            var url2 = "http://192.168.1.33:4000/api/save_token/" + token;
            http.get(url2).then((response) {
              print("Response status url2: ${response.statusCode}");
              print("Response body url2:  ${response.body}");
            });
          });
        } else {
          print(
            "Something Went wrong",
          );
        }
      });
    }
    on PlatformException catch (ex) {
      if (ex.code == BarcodeScanner.CameraAccessDenied) {
        result = "Unknown Error";
        print("$result");
      } else {
        result = "UnKnown Error $ex";
        print("$result");
      }
    } on FormatException {
      result = "You pressed the back button too soon";
      print("$result");
      ;
    }
  }

  //snackbar
  static _showSnackBar(message) {
    final snackBar = new SnackBar(
      content: new Text(message),
      duration: new Duration(seconds: 5),
      backgroundColor: Colors.green,
    );
    _scaffoldKey.currentState.showSnackBar(snackBar);
  }


  Widget build(BuildContext context) {
    return new Scaffold(
      key: _scaffoldKey,
      appBar: new AppBar(
        title: new Text("KIAM"),
        backgroundColor: Colors.orangeAccent,
      ),
      body: new Container(
        alignment: Alignment.topCenter,
        child: new Image.asset(
          'images/logo.png',
          width: 300.0,
          height: 200.0,
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.orangeAccent,
        icon: Icon(
          Icons.camera_alt,
          color: Colors.white,
        ),
        label: Text(
          "Register Your Device",
          style: TextStyle(color: Colors.white),
        ),
        onPressed: scanQR,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
