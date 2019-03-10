import { withRouter } from 'next/router';
import Layout from '../components/MyLayout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import moment from 'moment-timezone';
import geolib from 'geolib';
import Stack from '../components/Stack';

import posed from 'react-pose';

const props = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

const Box = posed.div(props);

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      daysAgo: 0,
      millisecond: 0,
      date: '',
      images: [],
      location: {
        lat: 0,
        lng: 0
      },
      distance: 0,
      isVisible: false
    }
  }

  static async getInitialProps(context) {
    const { id } = await context.query;
    const res = await fetch(`https://wfc-2019.firebaseapp.com/image/${id}`);
    const json = await res.json();
    
    const single = json.data;

    return { single: single };
  }

  componentDidMount() {
    const props = this.props;
    const single = props.single;
    const today = moment().tz("Asia/Tokyo").format('x');
    const postDate = moment(single.postDatetime).tz("Asia/Tokyo").format('x')
    const daysAgo = Math.floor((today - postDate) / (1000*60*60*24))
    const date = moment(single.postDatetime).tz("Asia/Tokyo").format('dddd, MMMM Do YYYY');
    const dist = geolib.getDistance(
      {latitude: '40', longitude: '137'},
      {latitude: single.location.lat, longitude: single.location.lng}
    );

    this.setState({
      daysAgo: daysAgo,
      millisecond: single.postDatetime,
      date: date,
      location: {
        lat: single.location.lat,
        lng: single.location.lng
      },
      distance: geolib.convertUnit('km', dist, 0),
      isVisible: true
    })
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    const single = props.single;
    const today = moment().tz("Asia/Tokyo").format('x');
    const postDate = moment(single.postDatetime).tz("Asia/Tokyo").format('x')
    const daysAgo = Math.floor((today - postDate) / (1000*60*60*24))
    const date = moment(single.postDatetime).tz("Asia/Tokyo").format('dddd, MMMM Do YYYY');
    const imagesDateFiltered = this.state.images.filter(image => {
      moment(image.postDatetime).tz("Asia/Tokyo").format('dddd, MMMM Do YYYY') == this.state.date
    })
    const dist = geolib.getDistance(
      {latitude: '40', longitude: '137'},
      {latitude: single.location.lat, longitude: single.location.lng}
    );

    if(this.props !== prevProps) {
      this.setState({
        daysAgo: daysAgo,
        millisecond: single.postDatetime, 
        date: date,
        location: {
          lat: single.location.lat,
          lng: single.location.lng
        },
        distance: geolib.convertUnit('km', dist, 0),
        isVisible: true
      }) 
    }
  }

  render() {
    const props = this.props;
    const single = props.single;


    return(
      <Layout>
        <Stack {...props} />
        <div className='wrapper'>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
          </Head>
          <Box className="box" pose={this.state.isVisible ? 'visible' : 'hidden'}>
            <div className='contents'>
              <div className='meta'>{this.state.daysAgo == 0 ? `TODAY` : `${this.state.daysAgo}DAYS AGO`}, { `${this.state.distance} KM AWAY`}</div>
              <Link href={`/`}>
                <img src={single.url} alt={single.id}/>
              </Link>
            </div>
          </Box>
          <style jsx>{`
            .wrapper {
              max-width: 700px;
              margin: 0 auto;
            }

            .contents {
              width: 100%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              height: 424px;
              max-width: 768px
            }

            .meta {
              letter-spacing: 1.6px;
              margin-bottom: 16px;
              margin-left: 8px;
              text-align: center;
            }

            .box {
            }

            img {
              max-height: 85%;
              width: 100%;
              object-fit: contain;
            }
          `}</style>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Page);