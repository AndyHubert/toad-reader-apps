import React, { useCallback } from "react"
import { StyleSheet, ScrollView, Text } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import EditToolData from './EditToolData'

import { i18n } from "inline-i18n"
import { nonEmpty, validDomain, validUrl } from '../../utils/toolbox'

import useClassroomInfo from '../../hooks/useClassroomInfo'
import useChangeIndex from '../../hooks/useChangeIndex'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  previewLine: {
    marginVertical: 7,
    fontWeight: '500',
    fontSize: 16,
  },
})

const LTIConfigurations = React.memo(({
  bookId,
  inEditMode,
  goUpdateClassroom,

  books,
  userDataByBookId,
}) => {

  const { accountId, classroom, isDefaultClassroom, hasOptionsDraftData } = useClassroomInfo({ books, bookId, userDataByBookId })

  const changeIndex = useChangeIndex(hasOptionsDraftData, (prev, current) => (prev && !current))

  const transformData = useCallback(
    ({ data }) => {
      data.lti_configurations.forEach(ltiConfiguration => {
        if(ltiConfiguration.domain) {
          ltiConfiguration.domain = ltiConfiguration.domain.trim()
          if(validUrl(ltiConfiguration.domain)) {
            ltiConfiguration.domain = ltiConfiguration.domain.replace(/^https:\/\//, "")
          }
        }
        if(ltiConfiguration.key) {
          ltiConfiguration.key = ltiConfiguration.key.trim()
        }
        if(ltiConfiguration.secret) {
          ltiConfiguration.secret = ltiConfiguration.secret.trim()
        }
      })
    },
    [],
  )

  if(!classroom) return null

  const { uid, lti_configurations, draftData } = classroom

  const data = {}
  const hasDraft = (draftData || {}).lti_configurations !== undefined

  if(inEditMode && hasDraft) {
    data.lti_configurations = draftData.lti_configurations
  } else if(lti_configurations) {
    data.lti_configurations = lti_configurations
  }

  if(inEditMode) {

    return (
      <ScrollView style={styles.container}>
        <EditToolData
          key={changeIndex}
          classroomUid={uid}
          classroom={classroom}
          isDefaultClassroom={isDefaultClassroom}
          accountId={accountId}
          dataStructure={[
            {
              name: 'lti_configurations',
              type: [
                {
                  name: 'domain',
                  type: 'string',
                  label: i18n("Domain", "", "enhanced"),
                  placeholder: i18n("Eg. {{example}}", "", "enhanced", { example: "toadreader.com" }),
                  required: true,
                  hasErrorWithMessage: ({ dataSegment: { domain } }) => (
                    nonEmpty(domain)
                    && !validDomain(domain)
                    && i18n("Invalid domain.", "", "enhanced")
                  ),
                },
                {
                  name: 'key',
                  type: 'string',
                  label: i18n("Key", "", "enhanced"),
                  required: true,
                },
                {
                  name: 'secret',
                  type: 'string',
                  label: i18n("Secret", "", "enhanced"),
                  required: true,
                },
              ],
              addLabel: i18n("Add another LTI configuration", "", "enhanced"),
              maxItems: 25,
            },
          ]}
          transformData={transformData}
          data={data}
          goUpdateTool={goUpdateClassroom}
        />
      </ScrollView>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {(data.lti_configurations || [])
        .filter(({ domain, key, secret }) => (
          validDomain(domain)
          && key
          && secret
        ))
        .map(({ domain }) => (
          <Text style={styles.previewLine}>
            {domain}
          </Text>
        ))
      }
    </ScrollView>
  )
})

const mapStateToProps = ({ books, userDataByBookId }) => ({
  books,
  userDataByBookId,
})

const matchDispatchToProps = (dispatch, x) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, matchDispatchToProps)(LTIConfigurations)