'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image
} = React;

var DOMParser = require('xmldom').DOMParser;

var FEED_URL = 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL8B03F998924DA45B';


var App = React.createClass({
  getInitialState: function() {
    return {
      videos: []
    }
  },
  parseVideos: function(s) {
    console.log('Parsing the feed...');
    var doc = new DOMParser().parseFromString(s, 'text/xml');
    var objs = [];
    var videos = doc.getElementsByTagName('yt:videoId');
    var thumbs = doc.getElementsByTagName('media:thumbnail');
    try {
      for (var i=0; i < videos.length; i++) {
        objs.push({
          id: videos[i].textContent,
          thumbnail: thumbs[i].getAttribute('url')
        })
      }
      this.setState({videos: objs});
    } catch(error) {
      // TODO: remove this
      console.log('Error parsing the feed: ', error);
    }
  },
  fetchVideos: function() {
    console.log('Fetching video feed...');
    fetch(FEED_URL)
      .then((response) => response.text())
      .then((responseText) => {
        this.parseVideos(responseText);
      })
      .catch((error) => {
        console.log('Error fetching the feed: ', error);
      });
  },
  componentDidMount: function() {
    this.fetchVideos();
  },
  render: function() {
    return (
      <View>
        {
          this.state.videos.map(video => {
            return <Text>{video.id}</Text>
          })
        }
      </View>
    );
  }
});

AppRegistry.registerComponent('App', () => App);
