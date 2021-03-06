import React from "react"
import { StyleSheet, View } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { i18n } from "inline-i18n"

import useClassroomInfo from '../../hooks/useClassroomInfo'
import useChangeIndex from '../../hooks/useChangeIndex'
import useWideMode from "../../hooks/useWideMode"

import EditToolData from './EditToolData'
import FlipEditorContent from '../basic/FlipEditorContent'

const container = {
  paddingHorizontal: 20,
  flex: 1,
}

const styles = StyleSheet.create({
  container: {
    ...container,
  },
  containerWideMode: {
    ...container,
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

  const { accountId, classroom, hasFrontMatterDraftData } = useClassroomInfo({ books, bookId, userDataByBookId })

  const wideMode = useWideMode()

  const changeIndex = useChangeIndex(hasFrontMatterDraftData, (prev, current) => (prev && !current))

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
        isDefaultClassroom={false}
        accountId={accountId}
        dataStructure={[
          {
            name: 'introduction',
            type: 'text',
            placeholder: i18n("Enter your introduction here.", "", "enhanced"),
          },
        ]}
        data={data}
        goUpdateTool={goUpdateClassroom}
      />
    )
  }

  return (
    <View style={wideMode ? styles.containerWideMode : styles.container}>
      <FlipEditorContent
        content={data.introduction}
      />
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