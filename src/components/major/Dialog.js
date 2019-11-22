import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Button } from "react-native-ui-kitten"
// import { Modal, Button } from "react-native-ui-kitten"
import { Modal } from "../ui-fixes/Modal"
import { i18n } from "inline-i18n"
import CoverAndSpin from "../basic/CoverAndSpin"

import useDimensions from "../../hooks/useDimensions"

const styles = StyleSheet.create({
  modalBackdrop: {
    backgroundColor: "black",
    opacity: 0.5,
  },
  container: {
    minWidth: 280,
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 10,
    backgroundColor: "white",
    overflow: 'auto',
  },
  title: {
    fontSize: 18,
    padding: 20,
  },
  messageContainer: {
    padding: 20,
    paddingTop: 0,
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
})

const Dialog = ({
  open=true,
  type="info",  // options: info, (edit), confirm
  title,
  message,
  style,
  submitting,

  // specific to type="info"
  onClose,
  closeButtonText,
  closeButtonStatus="basic",

  // specific to type="confirm"
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  confirmButtonStatus="primary",
  cancelButtonStatus="basic",
  // TODO: doubleConfirm,  // for destructive and unreversible actions

  // for extra customization
  content="",  // use if it is not desired to have the message wrapped in the standard content View
  buttons,

}) => {
  
  // TODO: do fullscreen if small device size
  const { width, height } = useDimensions().window

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

  return (
    <Modal
      visible={!!open}
      allowBackdrop={true}
      backdropStyle={styles.modalBackdrop}
    >
      <View style={{ width }}>
        <View style={[
          styles.container,
          style,
        ]}>
          <Text style={styles.title}>{title || titles[type]}</Text>
          {!!message &&
            <View style={styles.messageContainer}>
              {(message instanceof Array ? message : [message]).map((paragraph, idx) => (
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
          {buttons.length > 0 &&
            <View style={styles.buttonContainer}>
              {buttons}
            </View>
          }
          {!!submitting && <CoverAndSpin />}
        </View>
      </View>
    </Modal>
  )
}

export default Dialog