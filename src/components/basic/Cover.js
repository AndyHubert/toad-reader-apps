import React from "react"
import { FileSystem } from "expo"
import { View, Text } from "native-base"
import { Image, StyleSheet } from "react-native"

import FullScreenSpin from "./FullScreenSpin"
import CoverCheck from "./CoverCheck"
// import CoverPercentage from "./CoverPercentage"
// import CoverSize from "./CoverSize"

const styles = StyleSheet.create({
  cover: {
    marginBottom: 30,
    marginRight: 10,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, .1)',
    overflow: 'hidden',
    padding: 10,
  },
  title: {
    color: 'rgba(0, 0, 0, .7)',
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

class Cover extends React.Component {

  state = {
    imageError: false,
  }

  imageOnError = () => this.setState({ imageError: true })
  
  render() {
    const { bookId, bookInfo, bookWidth } = this.props
    const { title, coverHref, downloadStatus, epubSizeInMB, totalCharacterCount } = bookInfo
    const { imageError } = this.state

    return (
      <View
        style={[
          styles.cover,
          {
            width: bookWidth,
            paddingTop: bookWidth/.75,
          },
        ]}
      >
        {imageError &&
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        }
        <Image
          source={{ uri: coverHref }}
          style={styles.image}
          resizeMode='cover'
          onError={this.imageOnError}
        />
        {downloadStatus == 1 && <FullScreenSpin />}
        {downloadStatus == 2 && <CoverCheck />}
        {/* <CoverPercentage>{totalCharacterCount}</CoverPercentage> */}
        {/* <CoverSize>{epubSizeInMB}<CoverSize /> */}
      </View>
    )
  }
}

export default Cover