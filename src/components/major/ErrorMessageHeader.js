import React, { useEffect, useCallback } from "react"
import { StyleSheet, Platform } from "react-native"
import { Title, Left, Right, Icon, Button, Body } from "native-base"
import { withRouter } from "react-router"
import i18n from "../../utils/i18n.js"

import AppHeader from "../basic/AppHeader"

import { isPhoneSize, isStatusBarHidden, setStatusBarHidden } from '../../utils/toolbox.js'
import useSetTimeout from "../../hooks/useSetTimeout.js"

const styles = StyleSheet.create({
  title: {
    ...(Platform.OS === 'ios' && isPhoneSize() ? { marginLeft: -50, left: -20 } : {}),
  },
})

const ErrorMessageHeader = React.memo(({
  history,
  location,
}) => {

  const priorStatusBarHiddenValue = useRef(isStatusBarHidden())
  const [ setHideStatusBarTimeout ] = useSetTimeout()

  useEffect(
    () => setHideStatusBarTimeout(() => setStatusBarHidden(false), 20),
    [],
  )

  const onBackPress = useCallback(
    () => {
      setStatusBarHidden(priorStatusBarHiddenValue)
      history.goBack()
    },
    [ history ],
  )

  const { title, critical } = location.state || {}
  
  return (
    <AppHeader>
      <Left>
        {!critical &&
          <Button
            transparent
            onPress={onBackPress}
          >
            <Icon name="arrow-back" />
          </Button>
        }
      </Left>
      <Body>
        <Title style={styles.title}>{title || i18n("Error")}</Title>
      </Body>
      <Right />
    </AppHeader>
  )
})

export default withRouter(ErrorMessageHeader)
