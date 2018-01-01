import React from "react"
import { Text, ListItem } from "native-base"

const baseListItemStyle = {
  backgroundColor: 'transparent',
}

class BookContentsLine extends React.Component {

  goToHref = () => {
    const { goToHref, href } = this.props

    goToHref({ href })
  }

  render() {
    const { indentLevel, label } = this.props

    return (
      <ListItem
        style={{...baseListItemStyle, paddingLeft: indentLevel * 20 }}
        onPress={this.goToHref}
      >
        <Text>{label}</Text>
      </ListItem>
    )
  }
}

export default BookContentsLine