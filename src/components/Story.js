import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import SeeMore from './SeeMore'
import globalStyle from './../styles.css'

export default class Story extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      id: props.story.id
    }
    this.getStoryContent = this.getStoryContent.bind(this)
  }

  componentDidMount() {
    if (!this.props.story.url && this.props.story.type !== 'video') {
      this.pauseId && clearTimeout(this.pauseId)
      this.props.action('play', true)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.story.id !== prevProps.story.id) {
      if (!this.props.story.url && this.props.story.type !== 'video') {
        this.pauseId && clearTimeout(this.pauseId)
        this.props.action('play', true)
        this.setState({
          loaded: true
        })
      } else {
        this.pauseId && clearTimeout(this.pauseId)
        this.pauseId = setTimeout(() => {
          this.setState({ loaded: false })
        }, 300)
        this.props.action('pause', true)
      }
      this.vid &&
        this.vid.addEventListener('waiting', () => {
          this.props.action('pause', true)
        })
      this.vid &&
        this.vid.addEventListener('playing', () => {
          this.props.action('play', true)
        })
    }
    if (
      this.vid &&
      this.props.playState !== prevProps.playState &&
      !this.props.bufferAction
    ) {
      if (this.props.playState) {
        this.vid.pause()
      } else {
        this.vid.play().catch(e => console.log(e))
      }
    }
  }
  toggleMore = show => {
    this.setState({ showMore: show })
  }
  imageLoaded = e => {
    try {
      /*   let img = document.getElementById('storyImage')
      if (img) {
        new this.props.fastAverageColor().getColorAsync(img, color => {
          document.getElementById('storyOv').style.backgroundColor = color.hex
          console.log('bg', color)
        })
      } */
      if (this.pauseId) clearTimeout(this.pauseId)
      this.setState({ loaded: true })
      this.props.action('play', true)
    } catch (e) {
      console.log(e)
    }
  }
  videoLoaded = () => {
    try {
      this.props.getVideoDuration(this.vid.duration)
      this.vid &&
        this.vid
          .play()
          .then(() => {
            this.imageLoaded()
          })
          .catch(e => {
            this.props.action('pause')
            console.log(e)
          })
    } catch (e) {
      console.log(e)
    }
  }

  getStoryContent() {
    let source =
      typeof this.props.story === 'object'
        ? this.props.story.url
        : this.props.story
    let storyContentStyles =
      this.props.story.styles ||
      this.props.storyContentStyles ||
      styles.storyContent
    let type = this.props.story.type === 'video' ? 'video' : 'image'
    if (type === 'image') {
      if (source) {
        return !this.props.story.text ? (
          <img
            id={'storyImage'}
            // crossOrigin='anonymous'
            style={storyContentStyles}
            src={source}
            onLoad={this.imageLoaded}
          />
        ) : (
          <div>
            <img
              id={'storyImage'}
              // crossOrigin='anonymous'
              style={storyContentStyles}
              src={source}
              onLoad={this.imageLoaded}
            />
            <h5 style={this.props.componentStyles.subText}>
              {this.props.story.text}
            </h5>
          </div>
        )
      }

      return (
        <h4 style={this.props.componentStyles.mainText}>
          {this.props.story.text}
        </h4>
      )
    } else {
      return (
        <video
          ref={r => {
            this.vid = r
          }}
          style={storyContentStyles}
          src={source}
          controls={false}
          onLoadedData={this.videoLoaded}
          autoPlay
        />
      )
    }
    /*  return (
      type === 'image' ? <img
          style={storyContentStyles}
          src={source}
          onLoad={this.imageLoaded}
        /> : (type === 'video' ? <video ref={r => { this.vid = r }} style={storyContentStyles} src={source} controls={false} onLoadedData={this.videoLoaded} autoPlay /> : null)
    ) */
  }
  render() {
    let isHeader =
      typeof this.props.story === 'object' && this.props.story.header
    return (
      <div
        // id='storyOv'
        style={{
          ...styles.story,
          width: this.props.width,
          height: this.props.height,
          backgroundColor: this.props.story.url
            ? 'unset'
            : this.props.componentStyles.defaultBgColor
        }}
      >
        {this.getStoryContent()}
        {isHeader && (
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 20,
              zIndex: 9999,
              cursor: 'pointer'
            }}
          >
            {this.props.header
              ? () => this.props.header(this.props.story.header)
              : (
                <Header
                  heading={this.props.story.header.heading}
                  subheading={this.props.story.header.subheading}
                  profileImage={this.props.story.header.profileImage}
                  link={this.props.story.header.link}
                  navigate={this.props.navigate}
                />
              )}
          </div>
        )}
        {!this.state.loaded && this.props.story.url && (
          <div
            style={{
              width: this.props.width,
              height: this.props.height,
              position: 'absolute',
              left: 0,
              top: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ccc'
            }}
          >
            {this.props.loader || <div className={globalStyle.spinner} />}
          </div>
        )}
        {this.props.story.seeMore && (
          <div
            style={{
              position: 'absolute',
              margin: 'auto',
              bottom: 0,
              zIndex: 9999,
              width: '100%'
            }}
          >
            <SeeMore
              action={this.props.action}
              toggleMore={this.toggleMore}
              showContent={this.state.showMore}
              seeMoreContent={this.props.story.seeMore}
              navigate={this.props.navigate}
            />
          </div>
        )}
      </div>
    )
  }
}

const styles = {
  story: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    boxShadow: 'inset 0px 24px 30px -18px black'
  },
  storyContent: {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
    //  margin: 'auto'
  }
}

Story.defaultProps = {
  componentStyles: {
    mainText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    },
    subText: {
      fontSize: '12px',
      color: 'white',
      textAlign: 'center'
    },
    defaultBgColor: '#000'
  }
}

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  height: PropTypes.number,
  width: PropTypes.number,
  action: PropTypes.func,
  loader: PropTypes.element,
  header: PropTypes.element,
  playState: PropTypes.bool,
  getVideoDuration: PropTypes.func,
  bufferAction: PropTypes.bool,
  storyContentStyles: PropTypes.object,
  navigate: PropTypes.func,
  componentStyles: PropTypes.object
}
