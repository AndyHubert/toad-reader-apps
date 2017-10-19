import React from "react"
import { Container, Header, Title, Left, Right, Body, Content, Text, Card, CardItem } from "native-base"

class Highlights extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Highlights</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Text>Highlights here</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default Highlights