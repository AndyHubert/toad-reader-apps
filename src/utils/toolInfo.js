import { i18n } from "inline-i18n"
import { nonEmpty, validUrl } from './toolbox'

export const getToolInfo = () => {
  const toolTypes = [
    {
      toolType: 'NOTES_INSERT',
      name: 'lead-pencil',
      pack: 'materialCommunity',
      text: i18n("Notes insert"),
      dataStructure: [
        {
          name: 'content',
          type: 'text',
          placeholder: i18n("Enter your notes here."),
        },
      ],
      readyToPublish: ({ content }) => nonEmpty(content),
    },
    {
      toolType: 'QUIZ',
      name: 'md-checkbox',
      text: i18n("Quiz"),
      dataStructure: [
        {
          name: 'questions',
          type: [
            {
              name: 'question',
              type: 'string',
              label: i18n("Question"),
            },
            {
              name: 'answers',
              type: ['choice'],
              label: i18n("Answers"),
              maxItems: 10,
            },
            {
              name: 'shuffle',
              type: 'boolean',
              label: i18n("Shuffle answers on each attempt"),
            },
          ],
          addLabel: i18n("Add a question"),
          maxItems: 50,
        },
        {
          name: 'shuffle',
          type: 'boolean',
          label: i18n("Shuffle questions on each attempt"),
        },
      ],
      readyToPublish: ({ questions=[] }) => (
        questions.length > 0
        && questions.every(({ question, answers=[], answersSelection }) => (
          nonEmpty(question)
          && answers.length > 0
          && answers.every(answer => nonEmpty(answer))
          && typeof answersSelection === 'number'
          && answersSelection >= 0
          && answersSelection < answers.length
        ))
      ),
    },
    {
      toolType: 'LTI',
      name: 'wrench',
      pack: 'materialCommunity',
      text: i18n("Learning (LTI) tool"),
      dataStructure: [
        {
          name: 'url',
          type: 'string',
          label: i18n("Launch URL"),
        },
      ],
      readyToPublish: ({ url }) => validUrl(url),
    },
    {
      toolType: 'VIDEO',
      name: 'youtube-play',
      pack: 'fontAwesome',
      text: i18n("Video"),
      dataStructure: [
        {
          name: 'videoLink',
          type: 'string',
          label: i18n("YouTube, Vimeo, MP4 or WebM link"),
        },
        {
          name: 'startTime',
          type: 'string',
          variant: 'short',
          label: i18n("Start time (optional)"),
          placeholder: 'Eg. 3:12',
        },
        {
          name: 'endTime',
          type: 'string',
          variant: 'short',
          label: i18n("End time (optional)"),
          placeholder: 'Eg. 12:14',
        },
      ],
      readyToPublish: ({ videoLink }) => validUrl(videoLink),
    },
    // {
    //   toolType: 'DISCUSSION_QUESTION',
    //   name: 'question-answer',
    //   pack: 'material',
    //   text: i18n("Discussion question"),
    //   dataStructure: [
    //     {
    //       name: 'question',
    //       type: 'string',
    //       label: i18n("Question"),
    //     },
    //   ],
    // },
    {
      toolType: 'REFLECTION_QUESTION',
      name: 'comment-question',
      pack: 'materialCommunity',
      text: i18n("Reflection question"),
      dataStructure: [
        {
          name: 'question',
          type: 'string',
          label: i18n("Question"),
        },
      ],
      readyToPublish: ({ question }) => nonEmpty(question),
    },
    // {
    //   toolType: 'POLL',
    //   name: 'poll',
    //   pack: 'materialCommunity',
    //   text: i18n("Poll question"),
    //   dataStructure: [
    //     {
    //       name: 'questions',
    //       type: [
    //         {
    //           name: 'question',
    //           type: 'string',
    //           label: i18n("Question"),
    //         },
    //         {
    //           name: 'choices',
    //           type: ['string'],
    //           label: i18n("Choices"),
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   toolType: 'DOCUMENT',
    //   name: 'md-document',
    //   text: i18n("Document"),
    //   dataStructure: [
    //     {
    //       name: 'filename',
    //       type: 'file',
    //       fileTypes: [
    //         'application/pdf',
    //         'application/msword',
    //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //       ],
    //     },
    //   ],
    // },
    // {
    //   toolType: 'IMAGES',
    //   name: 'md-image',
    //   text: i18n("Images"),
    //   dataStructure: [
    //     {
    //       name: 'filenames',
    //       type: 'files',
    //       fileTypes: [
    //         'image/png',
    //         'image/jpeg',
    //         'image/gif',
    //         'image/svg+xml',
    //         'image/webp',
    //       ],
    //     },
    //   ],
    // },
    // {
    //   toolType: 'AUDIO',
    //   name: 'audiotrack',
    //   pack: 'material',
    //   text: i18n("Audio"),
    //   dataStructure: [
    //     {
    //       name: 'filename',
    //       type: 'file',
    //       fileTypes: [
    //         'audio/mpeg',
    //       ],
    //     },
    //   ],
    // },
    {
      toolType: 'INSTRUCTOR_HIGHLIGHT',
      name: 'marker',
      pack: 'materialCommunity',
      text: i18n("Instructor’s highlight"),
    },
  ]

  const toolInfoByType = {}

  toolTypes.forEach(({ toolType, ...otherParams }) => {
    toolInfoByType[toolType] = otherParams
  })

  return {
    toolTypes: toolTypes.filter(({ toolType }) => toolType !== 'INSTRUCTOR_HIGHLIGHT'),
    toolInfoByType,
  }
}