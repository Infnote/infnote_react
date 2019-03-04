import React from 'react'

class ImgRender extends React.PureComponent {
    static defaultProps = {
        language: null,
    }
    
    render() {
        const { src, alt } = this.props
        return (
            <img style={{maxWidth: '100%'}} src={src} alt={alt} />
        )
    }
}

export default ImgRender
