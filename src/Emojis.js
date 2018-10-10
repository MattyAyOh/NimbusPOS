import React from "react"
import styled from "styled-components"
import Twemoji from "react-twemoji"

const Emoji = styled(Twemoji)`
  & > img {
    height: 1.2em;
  }
`

export default {
  mahjong: <Emoji>🀄️ </Emoji>,
  pool: <Emoji>🎱 </Emoji>,
  ktv: <Emoji>🎤 </Emoji>,
}
