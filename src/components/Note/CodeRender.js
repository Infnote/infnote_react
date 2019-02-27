import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

class CodeRender extends React.PureComponent {
    static defaultProps = {
        language: null,
    }
    
    render() {
        const { language, value } = this.props

        return (
            <SyntaxHighlighter language={language}>
                {value}
            </SyntaxHighlighter>
        )
    }
}

export default CodeRender
