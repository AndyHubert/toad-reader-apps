import React, { useState, useEffect, useCallback } from "react"
import { StyleSheet, View, Text } from "react-native"
import { i18n } from "inline-i18n"
import { cloneObj, getMBSizeStr } from '../../utils/toolbox'

import Icon from "../basic/Icon"
import Radio from "../basic/Radio"
import { default as MemoButton } from "../basic/Button"
import { Button } from 'react-native-ui-kitten'
import Input from "../basic/Input"
import TextInput from "../basic/TextInput"
import CheckBox from "../basic/CheckBox"
import FileImporter from "./FileImporter"

import useInstanceValue from '../../hooks/useInstanceValue'
import useSetTimeout from '../../hooks/useSetTimeout'

const trashButtonStyles = {
  borderRadius: '50%',
  width: 40,
  height: 40,
  marginTop: 'auto',
  marginBottom: 4,
  borderColor: 'transparent',
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flex: 1,
  },
  dataLine: {
    maxWidth: 900,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  input: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  shortInput: {
    width: 200,
  },
  textEditor: {
    outlineWidth: 0,
    flex: 1,
    margin: -30,
    padding: 30,
  },
  label: {
    color: 'rgb(143, 155, 179)',
    fontSize: 15,
    marginBottom: 8,
  },
  file: {
    marginBottom: 30,
  },
  fileName: {
    fontSize: 15,
    marginBottom: 8,
  },
  size: {
    fontSize: 15,
    color: 'rgba(0,0,0,.5)',
    marginBottom: 8,
  },
  arrayGroup: {
    // marginBottom: 15,
  },
  componentSetInArray: {
    maxWidth: 900,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(8, 37, 125, 0.15)',
    padding: 15,
    paddingBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
  },
  radio: {
    paddingBottom: 4,
    paddingHorizontal: 10,
  },
  trashIcon: {
    height: 20,
  },
  trashButton: trashButtonStyles,
  disabledTrashButton: {
    ...trashButtonStyles,
    backgroundColor: 'transparent',
  },
})

const EditToolData = React.memo(({
  classroomUid,
  toolUid,
  accountId,
  dataStructure,
  data,
  goUpdateTool,
}) => {

  const [ dataInEdit, setDataInEdit ] = useState({})
  const [ fileImportInfo, setFileImportInfo ] = useState({})

  useEffect(
    () => {
      setDataInEdit(data)
    },
    [ toolUid ],
  )

  const getDataInEdit = useInstanceValue(dataInEdit)
  const [ setToolDataSaveTimeout ] = useSetTimeout({ fireOnUnmount: true })

  const onChangeInfo = useCallback(
    ({ id, value, info }) => {
      const data = cloneObj(getDataInEdit())

      const dataNameStack = id.split('.').slice(1)
      let dataSegment = data

      const choiceSelectionIndex = info === 'choiceSelection'
        ? parseInt(dataNameStack.pop(), 10)
        : null

      while(dataNameStack.length > 1) {
        let structureSegment = dataNameStack.shift()
        let defaultValue = []
  
        if(/^[0-9]+$/.test(structureSegment)) {
          structureSegment = parseInt(structureSegment, 10)
          defaultValue = {}
        }
  
        dataSegment = dataSegment[structureSegment] = (dataSegment[structureSegment] || defaultValue)
      }

      const dataSegmentKey = dataNameStack[0]

      if(info === 'choiceSelection') {
        dataSegment[`${dataSegmentKey}Selection`] = choiceSelectionIndex
      } else if((value || {})._delete) {
        dataSegment.splice(dataSegmentKey, 1)
      } else {
        dataSegment[dataSegmentKey] = value
      }

      if(info === 'choice') {
        let spliceFrom = dataSegment.length
        for(let i=dataSegment.length - 1; i>=0; i--) {
          if(dataSegment[i].trim() !== '') {
            break
          }
          spliceFrom = i
        }
        dataSegment.splice(spliceFrom, dataSegment.length)
      }

      setDataInEdit(data)
      setToolDataSaveTimeout(
        () => {
          goUpdateTool({ data })
        },
        300,
      )
    },
    [ goUpdateTool ],
  )

  const onDeleteArrayItem = useCallback(
    params => onChangeInfo({ ...params, value: { _delete: true } }),
    [ onChangeInfo ],
  )

  const onDoneImportingFile = useCallback(() => setFileImportInfo({}), [])

  const TrashButtonIcon = useCallback(
    style => (
      <Icon
        name="md-trash"
        style={styles.trashIcon}
      />
    ),
    [],
  )

  if(!dataStructure || !data) return null

  const getDataStructureSet = ({
    dataStructure,
    dataSegment,
    dataNameStack=[],
    dataSegmentParent,
    dataSegmentKey,
    dataSegmentParentIsComplexArray,
  }) => (
    dataStructure.map(({
      name,
      type,
      variant,
      fileTypes,
      label,
      addLabel,
      maxItems,
      placeholder,
    }, dataStructureIndex) => {

      const id = ['tooldata', ...dataNameStack, name].join('.')

      switch(type) {

        case 'string': {
          return (
            <View key={id} style={styles.dataLine}>
              <View style={styles.inputContainer}>
                <Input
                  id={id}
                  placeholder={placeholder}
                  label={label}
                  value={dataSegment[name] || ""}
                  onChangeInfo={onChangeInfo}
                  style={variant === 'short' ? styles.shortInput : styles.input}
                />
                {!!dataSegmentParentIsComplexArray && dataStructureIndex === 0 &&
                  <MemoButton
                    id={['tooldata', ...dataNameStack].join('.')}
                    style={styles.trashButton}
                    appearance="ghost"
                    status="basic"
                    icon={TrashButtonIcon}
                    onPress={onDeleteArrayItem}
                  />
                }
              </View>
            </View>
          )
        }

        case 'choice': {
          const disabled = name === dataSegment.length - 1

          return (
            <View key={id} style={styles.dataLine}>
              <View style={styles.inputContainer}>
                <Radio
                  id={id}
                  info="choiceSelection"
                  style={styles.radio}
                  checked={name === dataSegmentParent[`${dataSegmentKey}Selection`]}
                  onChange={onChangeInfo}
                />
                <Input
                  id={id}
                  info={type}
                  placeholder={placeholder}
                  label={label}
                  value={dataSegment[name] || ""}
                  onChangeInfo={onChangeInfo}
                  style={variant === 'short' ? styles.shortInput : styles.input}
                />
                <MemoButton
                  id={id}
                  info={type}
                  style={disabled ? styles.disabledTrashButton : styles.trashButton}
                  appearance="ghost"
                  status="basic"
                  icon={TrashButtonIcon}
                  disabled={disabled}
                  onPress={onDeleteArrayItem}
                />
              </View>
            </View>
          )
        }

        case 'boolean': {
          return (
            <View key={id} style={styles.dataLine}>
              <View style={styles.buttonContainer}>
                <CheckBox
                  id={id}
                  // style={styles.checkbox}
                  text={label}
                  checked={!!dataSegment[name]}
                  onChangeInfo={onChangeInfo}
                />
              </View>
            </View>
          )
        }

        case 'text': {
          return (
            <TextInput
              id={id}
              key={id}
              placeholder={placeholder}
              multiline
              value={dataSegment[name] || ""}
              onChangeInfo={onChangeInfo}
              style={styles.textEditor}
            />
          )
        }
        case 'file': {
          return (
            <View key={id} style={styles.dataLine}>
              {!!dataSegment[name] &&
                <React.Fragment>
                  <Text style={styles.fileName}>
                    {i18n("File name: {{name}}", dataSegment[name])}
                  </Text>
                  <Text style={styles.size}>
                    {i18n("Size: {{size}}", { size: getMBSizeStr(dataSegment[name].size) })}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      status="basic"
                      size="small"
                      onPress={() => onChangeInfo({ id, value: null, info: type })}
                    >
                      {i18n("Remove")}
                    </Button>
                  </View>
                </React.Fragment>
              }
              {!dataSegment[name] &&
                <View style={styles.buttonContainer}>
                  <Button
                    status="primary"
                    onPress={() => {
                      setFileImportInfo({
                        open: true,
                        fileType: fileTypes.join(','),
                        classroomUid,
                        onSuccess: ([{ name, size, result: { filename } }]) => {
                          if(filename) {
                            onChangeInfo({
                              id,
                              value: {
                                name,
                                size,
                                filename,
                              },
                              info: type,
                            })
                          }
                        }
                      })
                    }}
                  >
                    {i18n("Upload file")}
                  </Button>
                </View>
              }
            </View>
          )
        }

        case 'files': {
          return (
            <View key={id} style={styles.dataLine}>
              {(dataSegment[name] || []).map((file, idx) => (
                <View key={file.filename} style={styles.file}>
                  <Text style={styles.fileName}>
                    {i18n("File name: {{name}}", file)}
                  </Text>
                  <Text style={styles.size}>
                    {i18n("Size: {{size}}", { size: getMBSizeStr(file.size) })}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      status="basic"
                      size="small"
                      onPress={() => {
                        onChangeInfo({
                          id,
                          value: [
                            ...dataSegment[name].slice(0, idx),
                            ...dataSegment[name].slice(idx+1),
                          ],
                          info: type,
                        })
                      }}
                    >
                      {i18n("Remove")}
                    </Button>
                  </View>
                </View>
              ))}
              <View style={styles.buttonContainer}>
                <Button
                  status="primary"
                  onPress={() => {
                    setFileImportInfo({
                      open: true,
                      fileType: fileTypes.join(','),
                      multiple: true,
                      classroomUid,
                      onSuccess: files => {
                        onChangeInfo({
                          id,
                          value: [
                            ...(dataSegment[name] || []),
                            ...files
                              .filter(({ result: { filename } }) => filename)
                              .map(({ name, size, result: { filename } }) => ({
                                name,
                                size,
                                filename,
                              })),
                          ],
                          info: type,
                        })
                      },
                    })
                  }}
                >
                  {i18n("Upload files")}
                </Button>
              </View>
            </View>
          )
        }

        default: {  // should be an array

          if(type instanceof Array) {

            const simpleArray = type.length === 1 && typeof type[0] === 'string'
            const dataArray = dataSegment[name]
              ? [...dataSegment[name]]
              : [simpleArray ? "" : {}]

            if(simpleArray && type[0] === 'choice' && dataArray.length < maxItems) {
              // Always have a blank option at the bottom
              dataArray.push("")
            }

            return (
              <View key={id} style={styles.arrayGroup}>
                {!!label &&
                  <Text style={styles.label}>
                    {label}
                  </Text>
                }
                {simpleArray
                  ? (
                    dataArray.map((x, idx) => (
                      <View key={idx} style={styles.simpleArrayContainer}>
                        {getDataStructureSet({
                          dataStructure: [{
                            name: idx,
                            type: type[0],
                            placeholder,
                          }],
                          dataSegment: dataArray,
                          dataNameStack: [ ...dataNameStack, name ],
                          dataSegmentParent: dataSegment,
                          dataSegmentKey: name,
                        })}
                        {/* {getActionIcons({ idx })} */}
                      </View>
                    ))
                  )
                  : (
                    dataArray.map((item, idx) => (
                      <View key={idx} style={styles.componentSetInArray}>
                        {getDataStructureSet({
                          dataStructure: type,
                          dataSegment: item,
                          dataNameStack: [ ...dataNameStack, name, idx ],
                          dataSegmentParentIsComplexArray: true,
                        })}
                        {/* {getActionIcons({ idx })} */}
                      </View>
                    ))
                  )
                }
                {!!addLabel &&
                  <View style={styles.dataLine}>
                    <View style={styles.buttonContainer}>
                      <Button
                        status="basic"
                        size="small"
                        disabled={dataArray.length >= maxItems}
                        onPress={() => {
                          onChangeInfo({
                            id,
                            value: [
                              ...(dataSegment[name] || [{}]),
                              {},
                            ],
                            info: type,
                          })
                        }}
                      >
                        {addLabel}
                      </Button>
                    </View>
                  </View>
                }
              </View>
            )
          }
        }

      }
    })
  )

  return (
    <View style={styles.container}>
      {getDataStructureSet({ dataStructure, dataSegment: dataInEdit })}
      <FileImporter
        open={!!fileImportInfo.open}
        fileType={fileImportInfo.fileType}
        multiple={!!fileImportInfo.multiple}
        accountId={accountId}
        relativePath={`/importfile/${classroomUid}`}
        onClose={onDoneImportingFile}
        onSuccess={fileImportInfo.onSuccess}
      />
    </View>
  )

})

export default EditToolData