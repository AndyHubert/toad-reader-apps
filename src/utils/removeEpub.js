import Expo, { FileSystem } from "expo"
import i18n from "./i18n.js"
import { ActionSheet, Toast } from "native-base"

import { getBooksDir, getSnapshotsDir } from "./toolbox.js"

const {
  REMOVE_ICON_COLOR,
} = Expo.Constants.manifest.extra

const removeEpub = async ({ bookId, success }) => {
  
  await FileSystem.deleteAsync(`${getBooksDir()}${bookId}`, { idempotent: true })
  await FileSystem.deleteAsync(`${getSnapshotsDir()}${bookId}`, { idempotent: true })

  success && success()

  console.log(`Done removing book ${bookId}.`)
}

export const confirmRemoveEPub = ({ books, bookId, setDownloadStatus, done }) => {
  ActionSheet.show(
    {
      options: [
        { text: i18n("Remove from device"), icon: "remove-circle", iconColor: REMOVE_ICON_COLOR },
        { text: i18n("Cancel"), icon: "close" }
      ],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      title: i18n(
        'Are you sure you want to remove "{{book_title}}" from this device?',
        {
          book_title: books[bookId].title,
        }
      ),
    },
    buttonIndex => {
      if(buttonIndex == 0) {
        setDownloadStatus({ bookId, downloadStatus: 0 })
        removeEpub({ bookId })
        done && done()
      }
    }
  )
}

export const confirmRemoveAllEPubs = ({ books, setDownloadStatus }) => {
  ActionSheet.show(
    {
      options: [
        { text: i18n("Remove all books"), icon: "remove-circle", iconColor: REMOVE_ICON_COLOR },
        { text: i18n("Cancel"), icon: "close" }
      ],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      title: i18n("Are you sure you want to remove all books from this device?"),
    },
    buttonIndex => {
      if(buttonIndex == 0) {
        Object.keys(books).forEach(bookId => {
          setDownloadStatus({ bookId, downloadStatus: 0 })
          removeEpub({ bookId })
        })
        Toast.show({
          text: i18n("All books removed."),
          buttonText: i18n("Okay"),
          duration: 5000,
        })
      }
    }
  )
}