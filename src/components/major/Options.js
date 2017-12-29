import React from "react"
import { Card, CardItem, Icon, Text, View } from "native-base"
import { StyleSheet, TouchableWithoutFeedback, BackAndroid } from "react-native"
import nativeBasePlatformVariables from 'native-base/src/theme/variables/platform'

import BackFunction from '../basic/BackFunction'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: nativeBasePlatformVariables.toolbarHeight,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 5,
  },
  cover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  options: {
    position: 'absolute',
    top: -2,
    right: 1,
  },
})

class Options extends React.Component {

  render() {
    const { options, requestHide } = this.props

    return (
      <View style={styles.container}>
        <BackFunction func={requestHide} />
        <TouchableWithoutFeedback
          onPress={requestHide}
        >
          <View style={styles.cover}>
          </View>
        </TouchableWithoutFeedback>
        <Card style={styles.options}>
          {options.map((option, index) => (
            <CardItem button
              key={index}
              onPress={() => {
                requestHide()
                option.onPress()
              }}
              style={styles.option}
            >
              {option.selected && <Icon name="checkmark" />}
              <Text>{option.text}</Text>
            </CardItem>
          ))}
        </Card>
      </View>
    )
  }
}

export default Options