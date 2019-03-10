import Layout from '../components/MyLayout.js';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Stack from '../components/Stack';
import LazyLoad from 'react-lazyload';

export default class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const props = this.props;
    const data = this.props.data;
    const images = data.images;
    
    return (
      <Layout>
        <div className='wrapper'>
          <Stack {...props}/>
          <div className='outer'>
            <div className='inner'>
              {images.map((image, i) => {
                return (
                  <LazyLoad key={i}>
                    <Link prefetch href={`/image?id=${image.id}`} as={`/image/${image.id}`}>
                        <a>
                          <img src={image.url}/>
                        </a>
                    </Link>
                  </LazyLoad>
                )
              })}
            </div>
          </div>
        </div>
        <style jsx>{`
          .wrapper {
          }
            overflow: hidden;
            overflow-y: scroll;
          }

          .inner {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          h1, a {
            font-family: 'Arial';
          }

          a {
          }

          img {
            height: 110px;
            width: 110px;
            margin: 5px;
            object-fit: cover;
          }
        `}</style>
      </Layout>
    );
  }
}
