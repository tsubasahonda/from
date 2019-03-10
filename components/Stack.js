import Link from 'next/link';
import VirtualList from 'react-tiny-virtual-list';
import moment from 'moment-timezone';
import geolib from 'geolib';

import posed from 'react-pose';

const props = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

const Box = posed.div(props);

class Stack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      images: [],
      isVisible: false
    }
  }

  componentDidMount() {
    if(!!this.props.single) {
      const images = this.props.data.images.filter(image => {
        return(
          moment(image.postDatetime).tz('Asia/Tokyo').format('YYMMDD') == moment(this.props.single.postDatetime).tz('Asia/Tokyo').format('YYMMDD')
          &&
          geolib.getDistance(
            {latitude: image.location.lat, longitude: image.location.lng},
            {latitude: this.props.single.location.lat, longitude: this.props.single.location.lng}
          ) < 2000000
        )
      })
      this.setState({
        images: images
      })
      this.setState({ isVisible: !this.state.isVisible });
    } else if(!this.props.single) {
      this.setState({
        images: this.props.data.images
      })
      this.setState({ isVisible: !this.state.isVisible });
    }
  }

  render() {
    const images = this.state.images;
    return (
      <div className='wrapper'>
        <Box className="box" pose={this.state.isVisible ? 'visible' : 'hidden'}>
          <div className='inner'>
            <VirtualList
              height={88}
              width='auto'
              scrollDirection='horizontal'
              itemCount={images.length}
              itemSize={140} // Also supports variable heights (array or function getter)
              overscanCount={10}
              renderItem={({index}) =>
                <Link key={index} href={`/image?id=${images[index].id}`} as={`/image/${images[index].id}`}>
                  <a style={{position: `absolute`, left: `${index * 140}px`}}>
                    <img src={images[index].url}/>
                  </a>
                </Link>
              }
            />
          </div>
        </Box>
        <style jsx>{`
          .wrapper {
            position: fixed;
            width: 100%;
            overflow: hidden;
            padding: 14px 8px;
            bottom: 0;
            background-color: black;
          }

          .box {
            display: flex;
          }

          .inner {
            width: 100%;
            height: 100%;
            display: flex;
            overflow-x: scroll;
            list-style-type: none;
          }

          a {
            padding: 0 10px;
          }
          
          img {
            width: 120px;
            height: 88px;
            object-fit: cover;
          }
        `}</style>
      </div>
    )
  }
}

export default Stack
