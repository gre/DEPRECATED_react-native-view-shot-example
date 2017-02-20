import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Switch,
  TextInput,
  Picker,
  Slider,

} from "react-native";
import omit from "lodash/omit";
import { takeSnapshot } from "react-native-view-shot";

import Btn from "./Btn";

const catsSource = {
  uri: "https://i.imgur.com/5EOyTDQ.jpg",
};

export default class App extends Component {
  state = {
    previewSource: catsSource,
    error: null,
    res: null,
    value: {
      format: "png",
      quality: 0.9,
      result: "file",
    },
  };

  snapshot = refname => () =>
    takeSnapshot(this.refs[refname], this.state.value)
    .then(res =>
      this.state.value.result !== "file"
      ? res
      : new Promise((success, failure) =>
      // just a test to ensure res can be used in Image.getSize
      Image.getSize(
        res,
        (width, height) => (console.log(res,width,height), success(res)),
        failure)))
    .then(res => this.setState({
      error: null,
      res,
      previewSource: { uri:
        this.state.value.result === "base64"
        ? "data:image/"+this.state.value.format+";base64,"+res
        : res }
    }))
    .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));

  render() {
    const { value, previewSource, error, res } = this.state;
    const { format, quality, width, height, result } = value;
    return (
      <ScrollView
        ref="full"
        style={styles.root}
        contentContainerStyle={styles.container}>
        <View
          ref="header"
          style={styles.header}>
          <Text style={styles.title}>
            😃 ViewShot Example 😜
          </Text>
          <View style={styles.p1}>
            <Text style={styles.text}>
              This is a{" "}
            </Text>
            <Text style={styles.code}>
              react-native-view-shot
            </Text>
            <Text style={styles.text}>
            {" "}showcase.
            </Text>
          </View>
          <View style={styles.preview}>
            { error
              ? <Text style={styles.previewError}>
                  {""+(error.message || error)}
                </Text>
              : <Image
                  resizeMode="contain"
                  style={styles.previewImage}
                  source={previewSource}
                /> }
          </View>
          <Text numberOfLines={1} style={styles.previewUriText}>
          {res ? res.slice(0, 200) : ""}
          </Text>
        </View>
        <View
          ref="form"
          style={styles.form}>
          <View style={styles.btns}>
            <Btn label="Reset" onPress={() => this.setState({ previewSource: catsSource })} />
            <Btn label="Snap Head" onPress={this.snapshot("header")} />
            <Btn label="Snap Form" onPress={this.snapshot("form")} />
            <Btn label="Snap Root" onPress={this.snapshot("full")} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Format</Text>
            <Picker
              style={styles.input}
              selectedValue={format}
              onValueChange={format => this.setState({ value: { ...value, format } })}>
              <Picker.Item label="PNG" value="png" />
              <Picker.Item label="JPEG" value="jpeg" />
              <Picker.Item label="WEBM (android only)" value="webm" />
              <Picker.Item label="INVALID" value="_invalid_" />
            </Picker>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Quality</Text>
            <Slider
              style={styles.input}
              value={quality}
              onValueChange={quality => this.setState({ value: { ...value, quality } })}
            />
            <Text>{(quality*100).toFixed(0)}%</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Size</Text>
            <Switch
              style={styles.switch}
              value={width!==undefined}
              onValueChange={checked => this.setState({
                value: omit({
                  ...value,
                  width: 300,
                  height: 300,
                }, checked ? [] : ["width","height"])
              })}
            />
            { width!==undefined ? <TextInput
              style={styles.inputText}
              value={""+width}
              keyboardType="number-pad"
              onChangeText={txt => !isNaN(txt) && this.setState({
                value: { ...value, width: parseInt(txt, 10) }
              })}
            /> : <Text style={styles.inputText}>(auto)</Text> }
            <Text>x</Text>
            { height!==undefined ? <TextInput
              style={styles.inputText}
              value={""+height}
              keyboardType="number-pad"
              onChangeText={txt => !isNaN(txt) && this.setState({
                value: { ...value, height: parseInt(txt, 10) }
              })}
            /> : <Text style={styles.inputText}>(auto)</Text> }
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Result</Text>
            <Picker
              style={styles.input}
              selectedValue={result}
              onValueChange={result => this.setState({ value: { ...value, result } })}>
              <Picker.Item label="file" value="file" />
              <Picker.Item label="base64" value="base64" />
              <Picker.Item label="data URI" value="data-uri" />
              <Picker.Item label="INVALID" value="_invalid_" />
            </Picker>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  container: {
    paddingVertical: 20,
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  p1: {
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#333",
  },
  code: {
    fontWeight: "bold",
    color: "#000",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    minWidth: 80,
    fontStyle: "italic",
    color: "#888",
  },
  switch: {
    marginRight: 50,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputText: {
    flex: 1,
    marginHorizontal: 5,
    color: "red",
    textAlign: "center",
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  previewImage: {
    width: 375,
    height: 300,
  },
  previewUriText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    padding: 10,
    paddingBottom: 0,
  },
  previewError: {
    width: 375,
    height: 300,
    paddingTop: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#c00",
  },
  header: {
    backgroundColor: "#f6f6f6",
    borderColor: "#000",
    borderWidth: 1,
    paddingBottom: 20,
  },
  form: {
    backgroundColor: "#fff",
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  }
});
