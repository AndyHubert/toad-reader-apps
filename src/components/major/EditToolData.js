import React, { useState, useEffect, useCallback } from "react"
import { StyleSheet, View, Text } from "react-native"
import { i18n } from "inline-i18n"
import { cloneObj, getMBSizeStr } from '../../utils/toolbox'

// import Icon from "../basic/Icon"
import { Button, RadioGroup, Radio } from 'react-native-ui-kitten'
import Input from "../basic/Input"
import CheckBox from "../basic/CheckBox"
import FileImporter from "./FileImporter"

import useInstanceValue from '../../hooks/useInstanceValue'
import useSetTimeout from '../../hooks/useSetTimeout'

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(8, 37, 125, 0.15)',
    padding: 15,
    paddingBottom: 5,
  },
  choiceContainer: {
    flexDirection: 'row',
  },
  choiceInput: {
    flex: 1,
  },
  radio: {
    paddingBottom: 4,
    paddingHorizontal: 10,
    height: '100%',
  },
})

const EditToolData = React.memo(({
  classroomUid,
  toolUidInEdit,
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
    [ toolUidInEdit ],
  )

  const getDataInEdit = useInstanceValue(dataInEdit)
  const [ setToolDataSaveTimeout ] = useSetTimeout()

  const onChangeInfo = useCallback(
    ({ id, value, info }) => {
      const data = cloneObj(getDataInEdit())

      const dataNameStack = id.split('.').slice(1)
      let dataSegment = data

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

      dataSegment[dataSegmentKey] = value

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

  const onDoneImportingFile = useCallback(() => setFileImportInfo({}), [])

  // const AddButtonIcon = useCallback(
  //   style => (
  //     <Icon
  //       name="add"
  //       pack="material"
  //       style={styles.addIcon}
  //     />
  //   ),
  //   [],
  // )

  if(!dataStructure || !data) return null

  const getDataStructureSet = ({ dataStructure, dataSegment, dataNameStack=[] }) => (
    <View style={styles.set}>
      {dataStructure.map(({
        name,
        type,
        variant,
        fileTypes,
        label,
        addLabel,
        placeholder,
      }) => {

        const id = ['tooldata', ...dataNameStack, name].join('.')

        switch(type) {

          case 'string': {
            return (
              <View key={id} style={styles.dataLine}>
                <Input
                  id={id}
                  placeholder={placeholder}
                  label={label}
                  value={dataSegment[name] || ""}
                  onChangeInfo={onChangeInfo}
                  style={variant === 'short' ? styles.shortInput : null}
                />
              </View>
            )
          }

          case 'choice': {
            return (
              <View key={id} style={styles.dataLine}>
                <View style={styles.choiceContainer}>
                  <RadioGroup
                    selectedIndex={-1}
                    onChange={() => alert('change')}>
                    <Radio style={styles.radio} />
                  </RadioGroup>
                  <Input
                    id={id}
                    info={type}
                    placeholder={placeholder}
                    label={label}
                    value={dataSegment[name] || ""}
                    onChangeInfo={onChangeInfo}
                    style={variant === 'short' ? styles.shortInput : styles.choiceInput}
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
                        onPress={() => onChangeInfo({ id })}
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
                            onChangeInfo({
                              id,
                              value: {
                                name,
                                size,
                                filename,
                              },
                            })
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
                              ...files.map(({ name, size, result: { filename } }) => ({
                                name,
                                size,
                                filename,
                              })),
                            ],
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

              if(simpleArray && type[0] === 'choice') {
                // Always have a blank option at the bottom
                dataArray.push("")
              }

              // const getActionIcons = ({ idx }) => (
              //   <ArrayItemActionsContainer
              //     simpleArray={simpleArray}
              //   >
              //     {!bindNumber &&
              //       <IconButton
              //         data-itemid={`${id}.${idx}`}
              //         onClick={this.onDeleteArrayItem}
              //       >
              //         <Icon>delete</Icon>
              //       </IconButton>
              //     }
              //     {!(hideChildReorderWhen && hideChildReorderWhen({ componentData: this.props.data, childData: dataArray[idx] })) &&
              //       <React.Fragment>
              //         <IconButton
              //           data-itemid={`${id}.${idx}`}
              //           onClick={this.onArrayItemUp}
              //           disabled={idx === 0}
              //         >
              //           <Icon>arrow_upward</Icon>
              //         </IconButton>
              //         <IconButton
              //           data-itemid={`${id}.${idx}`}
              //           onClick={this.onArrayItemDown}
              //           disabled={idx === dataArray.length - 1}
              //         >
              //           <Icon>arrow_downward</Icon>
              //         </IconButton>
              //       </React.Fragment>
              //     }
              //   </ArrayItemActionsContainer>
              // )

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
      })}
    </View>
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