import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    :root {
        --main-color: #FF4747;
        --pink-color: #FFD1D1;
        --white-color: #FFFFFF;
        --black-color: #000000;
        --darkgrey-color: #767676;
        --midgrey-color: #AAAAAA;
        --lightgrey-color: #F6F7F9;
        --grey-color: #E6E6E6;
        --neutralgrey-color: #CDCDCD;
        --guide-green-color: #65BF7F;
        --guide-gray-color: #909090;
        --guide-red-color: #FF5A5A;
    }

    body {
        margin: 0;
        font-family: "Pretendard", sans-serif;
        background-color: #F6F7F9;
    }

    input {
        outline: none;
    }

    button, textarea {
        font-family: "Pretendard", sans-serif;
    }

    &::-webkit-scrollbar {
        display: none;
    }
`

export default GlobalStyle