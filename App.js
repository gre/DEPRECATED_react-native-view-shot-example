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
    value: {
      format: "png",
      quality: 0.9,
    },
  };

  snapshot = refname => () =>
    takeSnapshot(this.refs[refname], this.state.value)
    .then(uri => this.setState({ error: null, previewSource: { uri } }))
    .catch(error => this.setState({ error, previewSource: null }));

  render() {
    const { value, previewSource, error } = this.state;
    const { format, quality, width, height } = value;
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
