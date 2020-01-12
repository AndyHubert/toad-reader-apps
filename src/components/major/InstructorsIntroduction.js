import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import EditToolData from './EditToolData'

import { i18n } from "inline-i18n"
import { textToReactNative } from "../../utils/toolbox"

import useClassroomInfo from '../../hooks/useClassroomInfo'
import useChangeIndex from '../../hooks/useChangeIndex'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
})

const InstructorsIntroduction = React.memo(({
  bookId,
  inEditMode,
  viewingPreview,
  goUpdateClassroom,

  books,
  userDataByBookId,
}) => {

  const { accountId, classroom, hasDraftData } = useClassroomInfo({ books, bookId, userDataByBookId })

  const changeIndex = useChangeIndex(hasDraftData, (prev, current) => (prev && !current))

  if(!classroom) return null

  const { uid, introduction, draftData } = classroom

  const data = {}
  const hasDraft = (draftData || {}).introduction !== undefined

  if(inEditMode && hasDraft) {
    data.introduction = draftData.introduction
  } else if(introduction) {
    data.introduction = introduction
  }

  if(inEditMode && !viewingPreview) {

    return (
      <EditToolData
        key={changeIndex}
        classroomUid={uid}
        accountId={accountId}
        dataStructure={[
          {
            name: 'introduction',
            type: 'text',
            placeholder: i18n("Enter your introduction here."),
          },
        ]}
        data={data}
        goUpdateTool={goUpdateClassroom}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Text>
        {textToReactNative(data.introduction)}
      </Text>
    </View>
  )
})

const mapStateToProps = ({ books, userDataByBookId }) => ({
  books,
  userDataByBookId,
})

const matchDispatchToProps = (dispatch, x) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, matchDispatchToProps)(InstructorsIntroduction)