import React from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { Modal, Button } from "@ui-kitten/components"
import { i18n } from "inline-i18n"
import CoverAndSpin from "../basic/CoverAndSpin"

import useDimensions from "../../hooks/useDimensions"
import useWideMode from "../../hooks/useWideMode"

const container = {
  minWidth: 280,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingBottom: 10,
  backgroundColor: "white",
  elevation: 4,
}

const styles = StyleSheet.create({
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, .5)",
  },
  modalBackdropInvisible: {
    backgroundColor: "transparent",
  },
  container: {
    ...container,
    maxWidth: 500,
  },
  containerWideMode: {
    ...container,
    maxWidth: '90%',
  },
  title: {
    fontSize: 18,
    padding: 20,
  },
  messageContainer: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
  },
  messageParagraph: {
    marginVertical: 10,
  },
  messageFirstParagraph: {
    marginTop: 0,
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(0,0,0,.5)',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  button: {
    margin: 4,
  },
  scrollView: {
    flexShrink: 1,
  }
})

const Dialog = React.memo(({
  open=true,
  type="info",  // options: info, (edit), confirm
  title,
  message,
  style,
  invisibleBackdrop,
  submitting,
  submittingPercentage,
  noScroll,

  // specific to type="info"
  onClose,
  closeButtonText,
  closeButtonStatus="basic",

  // specific to type="confirm"
  onConfirm,
  onCancel,
  confirmButtonDisabled,
  confirmButtonText,
  cancelButtonText,
  confirmButtonStatus="primary",
  cancelButtonStatus="basic",
  // TODO: doubleConfirm,  // for destructive and unreversible actions

  // for extra customization
  content="",  // use if it is not desired to have the message wrapped in the standard content View
  buttons,

}) => {

  const wideMode = useWideMode()

  // TODO: do fullscreen if small device size
  const { width, height } = useDimensions().window
  const maxHeight = height - 50

  const titles = {
    info: i18n("Note"),
    confirm: i18n("Confirmation"),
  }

  if(!buttons) {
    switch(type) {
      case "confirm": {
        buttons = [
          <Button
            key="cancel"
            size="small"
            onPress={onCancel}
            status={cancelButtonStatus}
            style={[
              styles.button,
            ]}
          >
            {cancelButtonText || i18n("Cancel")}
          </Button>,
          <Button
            key="confirm"
            size="small"
            onPress={onConfirm}
            status={confirmButtonStatus}
            disabled={!!confirmButtonDisabled}
            style={[
              styles.button,
            ]}
          >
            {confirmButtonText || i18n("Confirm")}
          </Button>,
        ]
        break
      }
      case "info":
      default: {
        buttons = [
          <Button
            key="close"
            size="small"
            onPress={onClose}
            status={closeButtonStatus}
            style={[
              styles.button,
            ]}
          >
            {closeButtonText || i18n("Okay")}
          </Button>,
        ]
        break
      }
    }
  }

  const MaybeScrollView = noScroll ? View : ScrollView

  return (
    <Modal
      visible={!!open}
      allowBackdrop={true}
      backdropStyle={invisibleBackdrop ? styles.modalBackdropInvisible : styles.modalBackdrop}
    >
      <View style={{ width }}>
        <View style={[
          wideMode ? styles.container : styles.containerWideMode,
          { maxHeight },
          style,
        ]}>
          <Text style={styles.title}>{title || titles[type]}</Text>
          <MaybeScrollView style={styles.scrollView}>
            {!!message &&
              <View style={styles.messageContainer}>
                {!(message instanceof Array) ? message : message.map((paragraph, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.messageParagraph,
                      idx === 0 ? styles.messageFirstParagraph : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        paragraph.textStyle,
                      ]}
                    >
                      {paragraph.text || paragraph}
                    </Text>
                  </View>
                ))}
              </View>
            }
            {!message && content}
          </MaybeScrollView>
          {buttons.length > 0 &&
            <View style={styles.buttonContainer}>
              {buttons}
            </View>
          }
          {!!submitting && (
            <CoverAndSpin
              percentage={submittingPercentage}
            />
          )}
        </View>
      </View>
    </Modal>
  )
})

export default Dialog