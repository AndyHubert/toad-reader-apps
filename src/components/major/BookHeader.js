import React, { useState, useCallback } from "react"
import { StyleSheet, Platform, Linking } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { OverflowMenu } from "react-native-ui-kitten"
import { i18n } from "inline-i18n"

import AppHeader from "../basic/AppHeader"
import HeaderIcon from "../basic/HeaderIcon"
import useWideMode from "../../hooks/useWideMode"
import useClassroomInfo from "../../hooks/useClassroomInfo"

import { confirmRemoveEPub } from "../../utils/removeEpub"
import { getFirstBookLinkInfo, getIdsFromAccountId } from "../../utils/toolbox"

import { removeFromBookDownloadQueue, setDownloadStatus, clearTocAndSpines, clearUserDataExceptProgress, toggleSidePanelOpen } from "../../redux/actions"

const styles = StyleSheet.create({
  faded: {
    opacity: .35,
    fontWeight: 200,
  },
  selected: {
    opacity: 1,
  },
})

const BookHeader = React.memo(({
  bookId,
  title,
  subtitle,
  mode,
  showDisplaySettings,
  toggleBookView,
  backToReading,
  hideOptions,
  onBackPress,

  books,
  sidePanelSettings,

  removeFromBookDownloadQueue,
  setDownloadStatus,
  clearTocAndSpines,
  clearUserDataExceptProgress,
  toggleSidePanelOpen,

  history,
}) => {

  const [ showOptions, setShowOptions ] = useState(false)
  const wideMode = useWideMode()

  const { book } = useClassroomInfo({ books, bookId })

  const bookLinkInfo = getFirstBookLinkInfo(book)

  const goToBookLink = useCallback(
    () => {
      const bookLinkInfo = getFirstBookLinkInfo(book)

      Linking.openURL(bookLinkInfo.href).catch(err => {
        console.log('ERROR: Request to open URL failed.', err)
        historyPush("/error", {
          message: i18n("Your device is not allowing us to open this link."),
        })
      })
    },
    [ book ],
  )

  const removeFromDevice = useCallback(
    () => {
      confirmRemoveEPub({
        books,
        removeFromBookDownloadQueue,
        setDownloadStatus,
        clearTocAndSpines,
        clearUserDataExceptProgress,
        bookId,
        done: () => {
          history.go(-2)
        }
      })
    },
    [ books, bookId ],
  )

  const moreOptions = [
    // {
    //   title: i18n("My highlights and notes"),
    //   onPress: goToHighlights,
    // },
    // {
    //   title: i18n("Recommend this book"),
    //   onPress: recommendBook,
    // },
    ...(!bookLinkInfo ? [] : [{
      title: bookLinkInfo.label,
      onPress: goToBookLink,
    }]),
    ...(Platform.OS === 'web' ? [] : [{
      title: i18n("Remove from device"),
      onPress: removeFromDevice,
    }]),
  ]

  const toggleShowOptions = useCallback(
    () => setShowOptions(!showOptions),
    [ showOptions ],
  )

  const selectOption = useCallback(
    selectedIndex => {
      const { onPress } = moreOptions[selectedIndex]
      if(onPress) {
        onPress()
        setShowOptions(false)
      }
    },
    [ bookLinkInfo, goToBookLink, removeFromDevice ],
  )

  const rightControls = [
    <HeaderIcon
      name="format-size"
      pack="materialCommunity"
      onPress={showDisplaySettings}
      style={wideMode ? styles.faded : {}}
    />,
    <HeaderIcon
      name="md-list"
      onPress={wideMode ? toggleSidePanelOpen : backToReading}
      style={[
        wideMode ? styles.faded : {},
        (wideMode && sidePanelSettings.open) ? styles.selected : null,
      ]}
    />,
    ...(!(wideMode && Platform.OS !== 'web') ? [] : [
      <HeaderIcon
        name="md-apps"
        onPress={toggleBookView}
        style={wideMode ? styles.faded : {}}
      />
    ]),
    ...(!(!wideMode && Platform.OS !== 'web') ? [] : [
      <HeaderIcon
        name={[ 'pages', 'zooming' ].includes(mode) ? "md-list" : "md-apps"}
        onPress={toggleBookView}
      />
    ]),
    ...(moreOptions.length === 0 ? [] : [
      <OverflowMenu
        data={moreOptions}
        visible={showOptions}
        onSelect={selectOption}
        onBackdropPress={toggleShowOptions}
        placement='bottom end'
      >
        <HeaderIcon
          name="md-more"
          onPress={toggleShowOptions}
          style={wideMode ? styles.faded : {}}
        />
      </OverflowMenu>,
    ]),
  ]

  return (
    <>
      <AppHeader
        hide={mode === 'page' && !wideMode}
        title={title}
        subtitle={subtitle}
        titleCentered={true}
        leftControl={
          <HeaderIcon
            name="md-arrow-back"
            onPress={onBackPress}
            style={wideMode ? styles.faded : {}}
          />
        }
        rightControls={!hideOptions ? rightControls : []}
        titleStyle={wideMode ? styles.faded : {}}
      />
    </>
  )
})

const mapStateToProps = ({ books, sidePanelSettings }) => ({
  books,
  sidePanelSettings,
})

const matchDispatchToProps = (dispatch, x) => bindActionCreators({
  removeFromBookDownloadQueue,
  setDownloadStatus,
  clearTocAndSpines,
  clearUserDataExceptProgress,
  toggleSidePanelOpen,
}, dispatch)

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(BookHeader))