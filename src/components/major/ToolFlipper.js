import React, { useMemo, useCallback } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { ViewPager, Button } from "react-native-ui-kitten"
import Tool from "./Tool"
import Icon from "../basic/Icon"

import { getToolbarHeight } from '../../utils/toolbox'

import useWideMode from "../../hooks/useWideMode"
import useClassroomInfo from '../../hooks/useClassroomInfo'

import { setSelectedToolUid } from "../../redux/actions"

const buttonContainer = {
  position: 'absolute',
  top: getToolbarHeight(),
  bottom: 30,   // this is the padding-bottom in the reader
  justifyContent: 'center',
  zIndex: 5,
}

const button = {
  position: 'absolute',
  width: 50,
  height: 120,
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 5,
  },
  constainerWideMode: {
    top: getToolbarHeight(),
  },
  toolContainer: {
    flex: 1,
  },
  leftButtonContainer: {
    ...buttonContainer,
    left: -10,
  },
  leftButton: {
    ...button,
    left: 0,
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
  rightButtonContainer: {
    ...buttonContainer,
    right: -10,
  },
  rightButton: {
    ...button,
    right: 0,
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  icon: {
    height: 28,
    tintColor: '#b3b3b3',
  }
})

const ToolFlipper = React.memo(({
  bookId,
  inEditMode,
  goTo,

  books,
  userDataByBookId,

  setSelectedToolUid,
}) => {

  const { selectedTool, visibleTools, spines } = useClassroomInfo({ books, bookId, userDataByBookId, inEditMode })

  const wideMode = useWideMode()

  const toolSet = useMemo(
    () => {
      const toolsInSameSet = visibleTools.filter(({ spineIdRef, cfi }) => (
        spineIdRef === (selectedTool || {}).spineIdRef
        && !cfi
      ))
    
      toolsInSameSet.sort((a, b) => a.ordering - b.ordering)

      return toolsInSameSet
    },
    [ visibleTools, (selectedTool || {}).spineIdRef, inEditMode ],
  )

  const onPageChange = useCallback(
    pageIdx => {
      const { uid } = toolSet[pageIdx - 1] || {}

      if(!uid) {
        const followingSpineIndex = toolSet[0].spineIdRef === 'AFTER LAST SPINE'
          ? spines.length
          : spines.map(({ idref }) => idref).indexOf(toolSet[0].spineIdRef)
        const goToSpine = spines[pageIdx === 0 ? followingSpineIndex - 1 : followingSpineIndex]

        if(!goToSpine) return

        const spineIdRef = goToSpine.idref

        goTo({ spineIdRef })
      }

      setSelectedToolUid({
        bookId,
        uid,
      })
    },
    [ toolSet, bookId, spines, goTo ],
  )

  const LeftButtonIcon = useCallback(
    style => (
      <Icon
        style={styles.icon}
        pack="fontAwesome"
        name="angle-left"
      />
    ),
    [],
  )

  const RightButtonIcon = useCallback(
    style => (
      <Icon
        style={styles.icon}
        pack="fontAwesome"
        name="angle-right"
      />
    ),
    [],
  )

  if(!selectedTool) return null

  if(selectedTool.cfi) {  // no pager needed
    return (
      <View
        style={[
          styles.container,
          wideMode ? styles.constainerWideMode : null,
        ]}
      >
        <Tool
          bookId={bookId}
          inEditMode={inEditMode}
          tool={selectedTool}
        />
      </View>
    )  
  }

  const pageIndex = toolSet.map(({ uid }) => uid).indexOf(selectedTool.uid) + 1

  return (
    <>
      <ViewPager
        // The key prevents a bad onSelect call when creating a tool while another was selected.
        key={toolSet.length}
        style={[
          styles.container,
          wideMode ? styles.constainerWideMode : null,
        ]}
        selectedIndex={pageIndex}
        onSelect={onPageChange}
      >
        <View style={styles.toolContainer} />
        {toolSet.map(tool => (
          <View
            key={tool.currently_published_tool_uid || tool.uid}
            style={styles.toolContainer}
          >
            <Tool
              bookId={bookId}
              inEditMode={inEditMode}
              tool={tool}
            />
          </View>
        ))}
        <View style={styles.toolContainer} />
      </ViewPager>
      {Platform.OS === 'web' &&
        <>
          <View style={styles.leftButtonContainer} data-id="here">
            <Button
              onPress={() => onPageChange(pageIndex - 1)}
              appearance="ghost"
              style={styles.leftButton}
              icon={LeftButtonIcon}
            />
          </View>
          <View style={styles.rightButtonContainer}>
            <Button
              onPress={() => onPageChange(pageIndex + 1)}
              appearance="ghost"
              style={styles.rightButton}
              icon={RightButtonIcon}
            />
          </View>
        </>
      }
    </>
  )
})

const mapStateToProps = ({ books, userDataByBookId }) => ({
  books,
  userDataByBookId,
})

const matchDispatchToProps = (dispatch, x) => bindActionCreators({
  setSelectedToolUid,
}, dispatch)

export default connect(mapStateToProps, matchDispatchToProps)(ToolFlipper)