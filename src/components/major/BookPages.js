import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { View } from "native-base"
import { StyleSheet, Dimensions } from "react-native"

import PagesSpine from "../basic/PagesSpine.js"
import PagesPage from "../basic/PagesPage.js"

const MAXIMUM_PAGE_SIZE = 150

const styles = StyleSheet.create({
  container: {
  },
})

class BookPages extends React.Component {

  state={
    pageWidth: 0,
    pageHeight: 0,
  }

  componentDidMount() {
    this.calcPageWidth()
  }

  calcPageWidth = () => {
    const { width, height } = Dimensions.get('window')
    const maxWidth = height < width ? MAXIMUM_PAGE_SIZE : MAXIMUM_PAGE_SIZE * ( width / height )
    const pagesPerRow = parseInt(width / maxWidth)
    const pageWidth = (width - ((pagesPerRow + 1) * 10)) / pagesPerRow
    const pageHeight = pageWidth / ( width / height )
    this.setState({ pageWidth, pageHeight })
  }

  render() {

    const { navigation, books } = this.props
    const { bookId, goToHref } = navigation.state.params
    const { pageWidth, pageHeight } = this.state

    return (
      <View
        style={styles.container}
        onLayout={this.calcPageWidth}
      >
        {(books[bookId].spines || []).map((spine, index) => (
          <PagesSpine
            key={index}
            heading={spine.label}
          >
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
          </PagesSpine>
        ))}
        {(books[bookId].spines || []).map((spine, index) => (
          <PagesSpine
            key={index}
            heading={spine.label}
          >
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
            <PagesPage pageWidth={pageWidth} pageHeight={pageHeight} />
          </PagesSpine>
        ))}
        {/* <Button full rounded dark
          style={{ marginTop: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Text>Back to reading</Text>
        </Button> */}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  books: state.books,
})

const  matchDispatchToProps = (dispatch, x) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, matchDispatchToProps)(BookPages)