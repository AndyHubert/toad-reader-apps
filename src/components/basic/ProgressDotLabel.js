import React, { useState, useEffect } from "react"
import { StyleSheet, Platform, Text } from "react-native"
import { i18n } from "inline-i18n"
import useSetTimeout from '../../hooks/useSetTimeout'

const styles = StyleSheet.create({
  dotText: {
    fontSize: 10,
    color: Platform.OS === 'android' ? 'black' : 'white',
  },
})

const ProgressDotLabel = ({
  animatedScrollPosition,
  maxScroll,
}) => {

  const [ label, setLabel ] = useState('')
  const [ setUpdateTimeout ] = useSetTimeout()

  useEffect(
    () => {
      if(animatedScrollPosition) {

        const leftChangeListener = ({ value: scroll }) => {
          setUpdateTimeout(() => {
            const scrollPercentage = maxScroll ? Math.min(Math.round((scroll / maxScroll) * 100), 100) : 0
            setLabel(i18n("{{percent}}%", { percent: scrollPercentage }))
          }, 16)
        }

        animatedScrollPosition.addListener(leftChangeListener)
        return () => animatedScrollPosition.removeListener(leftChangeListener)

      }
    },
    [ maxScroll ],
  )

  return (
    <Text style={styles.dotText}>{label}</Text>
  )
}

export default ProgressDotLabel